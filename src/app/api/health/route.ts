import { NextResponse } from 'next/server';
import { Query } from 'node-appwrite';

import { createAdminClient } from '@/lib/appwrite';

/// O ping que mantém o projeto do Appwrite acordado.
///
/// ## Por que ele existe, e por que não é um ping na raiz do site
///
/// A Vercel não dorme — função serverless não tem inatividade. Quem pausa é o
/// **Appwrite**: projeto sem requisição por alguns dias entra em hibernação, e aí
/// o app volta quebrado sem ninguém ter mexido em nada.
///
/// Então o ping tem que **falar com o Appwrite**. Uma rota que devolve
/// `{ ok: true }` sem tocar em nada mantém a Vercel viva — que não estava em
/// risco — e deixa o Appwrite pausar do mesmo jeito.
///
/// ## `createAdminClient`, e não a sessão
///
/// A primeira versão disto ia ser um cron batendo em `/api/auth/me` com um cookie
/// de sessão fixo. **Cookie de sessão expira**: no dia em que expirasse, a rota
/// passaria a responder 401 sem consultar nada, o keep-alive morreria em silêncio,
/// e a descoberta seria o projeto pausado. A chave de servidor não expira e não
/// precisa ser guardada em nenhum lugar novo — ela já está no ambiente.
///
/// `users.get`/`users.list` é a leitura mais barata que a chave já tem permissão
/// para fazer: `createAdminClient().users` é usado pelas rotas de membros e de
/// tarefas, então o escopo existe.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  /// **A rota é aberta, então ela se protege pelo segredo do cron.**
  ///
  /// Uma rota pública que fala com o banco a cada chamada é superfície de abuso
  /// barata. Se `CRON_SECRET` existir no ambiente, a Vercel manda
  /// `Authorization: Bearer <segredo>` em todo disparo de cron, e aqui só passa
  /// quem tem ele. Sem a variável definida, a rota fica aberta — de propósito,
  /// para dar para testar no navegador antes de configurar.
  const segredo = process.env.CRON_SECRET;

  if (segredo && request.headers.get('authorization') !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false, erro: 'não autorizado' }, { status: 401 });
  }

  try {
    const { users } = await createAdminClient();

    /// Um usuário só: o que importa é a requisição ter acontecido, não o dado.
    await users.list([Query.limit(1)]);

    return NextResponse.json({ ok: true, appwrite: 'acordado', at: new Date().toISOString() });
  } catch (erro) {
    /// **503, e não 200 com `ok: false`.** É o status que faz um monitor externo
    /// distinguir "acordei o Appwrite" de "o Appwrite está fora" — e é a única
    /// forma de o ping avisar quando ele para de funcionar. Um keep-alive que
    /// falha em silêncio é pior que nenhum, porque dá a sensação de estar coberto.
    return NextResponse.json(
      { ok: false, erro: erro instanceof Error ? erro.message : 'desconhecido' },
      { status: 503 }
    );
  }
}
