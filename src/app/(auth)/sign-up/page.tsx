import { getUser } from '@/features/auth/actions';
import FormSignUp from '@/features/auth/components/form-signup';
import { redirect } from 'next/navigation';

export default async function SignUp() {
  const user = await getUser();

  if (user) {
    return redirect("/");
  }

  return (
    <FormSignUp />
  )
}
