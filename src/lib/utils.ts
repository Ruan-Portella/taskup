import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateInviteCode(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

export function statusToPTBR(str: string): string {
  const statusPtBR: { [key: string]: string } = {
    'BACKLOG': 'Pendente',
    'TODO': 'A Fazer',
    'IN_PROGRESS': 'Em Progresso',
    'IN_REVIEW': 'Em Revisão',
    'DONE': 'Concluído',
  }

  return statusPtBR[str] as string;
}