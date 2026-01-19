"use client";

import { Languages } from "lucide-react";

import { Button } from "./button";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
];

export function LanguageSwitcher() {
  return (
    <Button variant="ghost" size="icon" aria-label="Switch language">
      <Languages className="h-5 w-5" />
    </Button>
  );
}