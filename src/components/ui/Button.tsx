import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "focus-ring inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
  {
    variants: {
      variant: {
        primary: "bg-indigo/90 hover:bg-indigo text-white shadow-glass",
        ghost: "bg-transparent hover:bg-white/5 border border-white/10",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(button({ variant }), className)} {...props} />;
}
