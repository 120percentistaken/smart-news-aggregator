// components/ReputationBadge.tsx
//
// Small colored badge showing an article's source-reliability rating.
// Purely presentational — takes the ReputationInfo object already
// attached to each Article and renders it.

import { type ReputationInfo } from "@/lib/reputation";

const STYLES: Record<string, string> = {
  high: "bg-green-100 text-green-800",
  mixed: "bg-yellow-100 text-yellow-800",
  low: "bg-orange-100 text-orange-800",
  very_low: "bg-red-100 text-red-800",
  satire: "bg-purple-100 text-purple-800",
  unknown: "bg-gray-100 text-gray-600",
};

const LABELS: Record<string, string> = {
  high: "High reliability",
  mixed: "Mixed reliability",
  low: "Low reliability",
  very_low: "Very low reliability",
  satire: "Satire",
  unknown: "Unrated",
};

export function ReputationBadge({ reputation }: { reputation: ReputationInfo }) {
  const style = STYLES[reputation.rating] ?? STYLES.unknown;
  const label = LABELS[reputation.rating] ?? LABELS.unknown;

  return (
    <span
      title={reputation.note}
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${style}`}
    >
      {label}
    </span>
  );
}