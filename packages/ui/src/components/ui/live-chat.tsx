"use client";

import { MessageCircle } from "lucide-react";

import { Button } from "./button";

export function LiveChat() {
  return (
    <Button variant="ghost" size="icon" aria-label="Live chat">
      <MessageCircle className="h-5 w-5" />
    </Button>
  );
}