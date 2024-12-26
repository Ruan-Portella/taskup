import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WorkspacesAvatarProps {
  image?: string;
  name: string;
  className?: string;
};

export const WorkspacesAvatar = (
  { image, name, className }: WorkspacesAvatarProps) => {
  if (image) {
    return (
      <div className={cn('size-10 relative rounded-md overflow-hidden', className)}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-10 rounded-md', className)}>
      <AvatarFallback className="rounded-md text-white bg-blue-600 font-semibold text-lg uppercase">{name[0]}</AvatarFallback>
    </Avatar>
  )
}