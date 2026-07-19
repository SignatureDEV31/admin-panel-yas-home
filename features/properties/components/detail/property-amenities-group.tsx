import React from "react";
import { CheckCircle2, XCircle, LucideIcon } from "lucide-react";

export interface AmenityItemConfig {
  key: string;
  label: string;
}

interface AmenityGroupProps {
  title: string;
  icon: LucideIcon;
  items: AmenityItemConfig[];
  amenitiesState: Record<string, boolean>;
  onToggle: (key: string) => void;
  gridCols?: string;
}

export const AmenityGroup: React.FC<AmenityGroupProps> = ({
  title,
  icon: Icon,
  items,
  amenitiesState,
  onToggle,
  gridCols = "grid-cols-2 sm:grid-cols-3",
}) => (
  <div className="space-y-3">
    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
      <Icon className="h-4 w-4 text-yashomePink" />
      {title}
    </span>
    <div className={`grid ${gridCols} gap-2.5`}>
      {items.map((item) => {
        const isActive = Boolean(amenitiesState[item.key]);
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
              isActive
                ? "bg-yashomePink/10 text-yashomePink border-yashomePink/40 shadow-xs"
                : "bg-muted/10 text-muted-foreground border-border/60 hover:bg-muted/30"
            }`}
          >
            <span>{item.label}</span>
            {isActive ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0 opacity-40" />
            )}
          </button>
        );
      })}
    </div>
  </div>
);
