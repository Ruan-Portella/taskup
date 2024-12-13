import { getUser } from '@/features/auth/actions';
import FormSignIn from '@/features/auth/components/form-signin';
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const user = await getUser();

  if (user) {
    return redirect("/");
  }

  return <FormSignIn />
}
