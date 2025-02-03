import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProjectAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallBackClassname?: string;
};

export const ProjectAvatar = (
  { image, name, className, fallBackClassname }: ProjectAvatarProps) => {
  if (image) {
    return (
      <div className={cn('size-5 relative rounded-md overflow-hidden', className)}>
        <Image src={image} alt={name} fill className="object-cover" />
      </div>
    );
  }

  return (
    <Avatar className={cn('size-5 rounded-md', className)}>
      <AvatarFallback className={cn("rounded-md text-white bg-blue-600 font-semibold text-sm uppercase", fallBackClassname)}>{name[0]}</AvatarFallback>
    </Avatar>
  )
}