import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
  category: string | null;
};

export const CategoryColumn = ({ category }: Props) => {
  return (
    <div className={cn("flex items-center", !category && 'text-rose-500')}>
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0"/> }
      {category || 'Sem Categoria'}
    </div>
  )
}