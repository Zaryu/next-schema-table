"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TableSettingsProps {
  autoScroll: boolean;
  onAutoScrollChange: (enabled: boolean) => void;
  labels?: {
    title?: string;
    autoScroll?: string;
  };
}

export function TableSettings({
  autoScroll,
  onAutoScrollChange,
  labels,
}: TableSettingsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{labels?.title || "Settings"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex items-center justify-between px-2 py-2">
          <Label htmlFor="auto-scroll" className="text-sm font-normal">
            {labels?.autoScroll || "Auto Scroll on page change"}
          </Label>
          <Switch
            id="auto-scroll"
            checked={autoScroll}
            onCheckedChange={onAutoScrollChange}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
