import * as React from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@repo/lib";
import { Button } from "./button";

export interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
    isActive?: boolean;
  }[];
}

export function NavMain({ items }: NavMainProps) {
  return (
    <div className="grid gap-1">
      {items.map((item) => (
        <Button
          key={item.title}
          variant={item.isActive ? "secondary" : "ghost"}
          className="justify-start gap-2 px-3"
          asChild
        >
          <a href={item.url}>
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.title}
            <ChevronRight className="ml-auto h-4 w-4" />
          </a>
        </Button>
      ))}
    </div>
  );
}