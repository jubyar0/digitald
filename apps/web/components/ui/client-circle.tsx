"use client";

import { Circle } from "lucide-react";

// Simple wrapper for the Circle icon from lucide-react
// This ensures consistent rendering between server and client to prevent hydration errors
export const ClientCircle = (props: React.ComponentProps<typeof Circle>) => {
  return <Circle {...props} />;
};