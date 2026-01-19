import * as React from "react";

import { cn } from "@repo/lib";
import { Button } from "./button";

interface Team {
  label: string;
  value: string;
}

interface TeamSwitcherProps {
  className?: string;
}

const groups = [
  {
    label: "Personal Account",
    teams: [
      {
        label: "Alicia Koch",
        value: "personal",
      },
    ],
  },
  {
    label: "Teams",
    teams: [
      {
        label: "Acme Inc.",
        value: "acme-inc",
      },
      {
        label: "Monsters Inc.",
        value: "monsters",
      },
    ],
  },
];

export function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [selectedTeam] = React.useState<Team>(groups[0].teams[0]);

  return (
    <Button
      variant="outline"
      className={cn("w-[200px] justify-between", className)}
    >
      <span>{selectedTeam.label}</span>
      <span className="ml-2 text-muted-foreground">▼</span>
    </Button>
  );
}