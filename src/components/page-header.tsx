import { Shield, Lock } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  section?: string;
}

export function PageHeader({ eyebrow, title, description, actions, section }: PageHeaderProps) {
  return (
    <header className="border-b border-border pb-5">
      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <Shield className="h-3 w-3 shrink-0 text-signal" />
          <span className="truncate">Karnataka State Police · Crime Intelligence Console</span>
        </div>
        <div className="hidden shrink-0 items-center gap-1 text-signal sm:flex">
          <Lock className="h-3 w-3" /> Restricted · For Official Use Only
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.25em] text-signal">
              {section ? `${section} · ` : ""}{eyebrow}
            </p>
          )}
          <h1 className="truncate font-display text-2xl font-semibold md:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
