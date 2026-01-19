import * as React from "react";
import { Folder, MoreHorizontal, Star } from "lucide-react";

import { cn } from "@repo/lib";
import { Button } from "./button";

export interface NavProjectsProps {
  projects: {
    name: string;
    url: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function NavProjects({ projects }: NavProjectsProps) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm font-medium text-muted-foreground">Projects</p>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More</span>
        </Button>
      </div>
      {projects.map((project) => (
        <Button
          key={project.name}
          variant="ghost"
          className="justify-start gap-2 px-3"
          asChild
        >
          <a href={project.url}>
            {project.icon ? (
              <project.icon className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )}
            {project.name}
          </a>
        </Button>
      ))}
    </div>
  );
}