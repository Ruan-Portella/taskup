import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
  category: {
    color: string;
    name: string;
  } | null;
};

export const CategoryColumn = ({ category }: Props) => {
  return (
    <div className={cn("flex items-center")}>
      {!category?.name ? (
        <>
          <TriangleAlert className="mr-2 size-4 shrink-0" />
          <p className="line-clamp-1">
          Sem categoria
          </p>
        </>
      ) : (
        <Badge variant='none' className="max-w-44" style={{ backgroundColor: `${category?.color}` }}>
          <div className="truncate">
          {category?.name}
          </div>
        </Badge>
      )}
    </div>
  )
}