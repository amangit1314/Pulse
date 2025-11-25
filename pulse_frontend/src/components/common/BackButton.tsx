"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="outline"
      className="flex items-center gap-2 rounded-xl shadow-sm"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}
