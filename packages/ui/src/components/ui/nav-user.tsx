import * as React from "react";
import { ChevronsUpDown, User } from "lucide-react";

import { cn } from "@repo/lib";
import { Button } from "./button";

export interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {user.email}
        </span>
      </div>
      <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}