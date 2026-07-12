import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "./States";
import { cn } from "../ui/utils";

export interface HistoryPoint {
  readonly label: string;
  readonly value: number;
  readonly value2?: number;
}

interface HistoryChartProps {
  readonly title: string;
  readonly description?: string;
  readonly data: ReadonlyArray<HistoryPoint>;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly variant?: "area" | "bar";
  readonly valueFormatter?: (value: number) => string;
  readonly seriesLabels?: { readonly primary: string; readonly secondary?: string };
  readonly height?: number;
  readonly className?: string;
  readonly headerAction?: ReactNode;
}

/** Plots stored history only — empty state when no points. */
export function HistoryChart({
  title,
  description,
  data,
  emptyTitle = "No history yet",
  emptyDescription = "Advance time to record data here.",
  variant = "area",
  valueFormatter = (v) => String(v),
  seriesLabels = { primary: "Value", secondary: "Series 2" },
  height = 220,
  className,
  headerAction,
}: HistoryChartProps) {
  return (
    <section className={cn("rounded-lg border border-border bg-surface-1 p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-display text-lg text-foreground">{title}</h2>
          {description ? (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          ) : null}
        </div>
        {headerAction}
      </div>
      {data.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} className="py-10" />
      ) : (
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            {variant === "bar" ? (
              <BarChart data={[...data]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip formatter={(v: number) => valueFormatter(v)} />
                <Bar dataKey="value" name={seriesLabels.primary} fill="var(--fenix-emerald)" radius={[6, 6, 0, 0]} />
                {seriesLabels.secondary ? (
                  <Bar dataKey="value2" name={seriesLabels.secondary} fill="var(--fenix-gold)" radius={[6, 6, 0, 0]} />
                ) : null}
              </BarChart>
            ) : (
              <AreaChart data={[...data]}>
                <defs>
                  <linearGradient id="fenixHistoryFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--fenix-emerald)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--fenix-emerald)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickFormatter={(v) => valueFormatter(Number(v))} />
                <Tooltip formatter={(v: number) => valueFormatter(v)} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name={seriesLabels.primary}
                  stroke="var(--fenix-emerald)"
                  fill="url(#fenixHistoryFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
