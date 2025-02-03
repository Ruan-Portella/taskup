import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MemberAvatarProps {
  fallbackClassname?: string;
  name: string;
  className?: string;
};

export const MemberAvatar = (
  { fallbackClassname, name, className }: MemberAvatarProps) => {

  return (
    <Avatar className={cn('size-10 transition border-none border-neutral-300 rounded-md', className)}>
      <AvatarFallback className={cn('bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center', fallbackClassname)}>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}