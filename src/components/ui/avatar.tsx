import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-32 w-32 text-3xl",
};

const onlineDotSizes = {
  xs: "h-2 w-2 border",
  sm: "h-2.5 w-2.5 border",
  md: "h-3 w-3 border-2",
  lg: "h-4 w-4 border-2",
  xl: "h-6 w-6 border-2",
};

export function Avatar({
  src,
  alt,
  size = "md",
  isOnline,
  className,
}: AvatarProps) {
  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === "xl" ? 128 : size === "lg" ? 64 : 40}
          height={size === "xl" ? 128 : size === "lg" ? 64 : 40}
          className={cn("object-cover", sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center bg-fb-blue font-semibold text-white",
            sizeClasses[size]
          )}
        >
          {getInitials(alt)}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-white",
            isOnline ? "bg-fb-green" : "bg-fb-text-muted",
            onlineDotSizes[size]
          )}
        />
      )}
    </div>
  );
}
