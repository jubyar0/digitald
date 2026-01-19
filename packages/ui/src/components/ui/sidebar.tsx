import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/lib";

const sidebarVariants = cva(
  "flex flex-col gap-2 p-4",
  {
    variants: {
      variant: {
        default: "bg-background border-r",
        floating: "bg-background rounded-lg border shadow-sm",
      },
      size: {
        default: "w-64",
        sm: "w-48",
        lg: "w-80",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  asChild?: boolean;
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  SidebarProps
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(sidebarVariants({ variant, size, className }))}
      {...props}
    />
  );
});
Sidebar.displayName = "Sidebar";

export { Sidebar, sidebarVariants };