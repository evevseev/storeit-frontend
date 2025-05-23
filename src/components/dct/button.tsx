import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type DctButtonProps = {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  href?: string;
};

export function DctButton({
  onClick,
  className,
  children,
  href,
}: Readonly<DctButtonProps>) {
  const btn = (
    <Button onClick={onClick} className={cn(className, "py-10")}>
      {children}
    </Button>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "default" }),
          className,
          "py-10"
        )}
      >
        {children}
      </Link>
    );
  }
  return btn;
}
