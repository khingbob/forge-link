import { useState } from "react";
import { SearchResult, ResultStatus } from "../../types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  Globe,
  Mail,
  Factory,
  CalendarDays,
  CheckCircle2,
  XCircle,
  PhoneOff,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ResultCardProps {
  result: SearchResult;
  onStatusChange: (status: ResultStatus, callDate?: string | null) => void;
  onRestart: () => void;
}

export function ResultCard({
  result,
  onStatusChange,
  onRestart,
}: ResultCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [callDate, setCallDate] = useState(result.agreedCallDate ?? "");

  function handleAccept() {
    onStatusChange("accepted", callDate || null);
  }

  function handleReject() {
    onStatusChange("rejected", null);
  }

  function handleCantReach() {
    onStatusChange("cant_reach", null);
  }

  function handleRestart() {
    setCallDate("");
    onRestart();
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const d = e.target.value;
    setCallDate(d);
    if (result.status === "accepted") {
      onStatusChange("accepted", d || null);
    }
  }

  const statusColor: Record<ResultStatus, string> = {
    pending: "border-zinc-800",
    accepted: "border-emerald-500/30",
    rejected: "border-red-500/20",
    cant_reach: "border-zinc-700",
  };

  return (
    <div
      className={`bg-zinc-900 border rounded-xl overflow-hidden transition-colors ${statusColor[result.status]}`}
    >
      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <h3 className="text-sm font-semibold text-zinc-100 truncate">
                {result.companyName}
              </h3>
              <Badge status={result.status} size="sm" />
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
              {result.description}
            </p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Factory size={11} className="text-zinc-600" />
            {result.industry}
          </span>
          <a
            href={`https://${result.website}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-400 transition-colors"
          >
            <Globe size={11} className="text-zinc-600" />
            {result.website}
          </a>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Mail size={11} className="text-zinc-600" />
            {result.contact}
          </span>
          {result.agreedCallDate && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
              <CalendarDays size={11} />
              Call:{" "}
              {new Date(result.agreedCallDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Fit explanation toggle */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-5 py-2.5 border-t border-zinc-800 hover:bg-zinc-800/40 transition-colors text-left cursor-pointer"
      >
        <span className="text-xs text-zinc-500 flex-1">Fit explanation</span>
        {expanded ? (
          <ChevronUp size={12} className="text-zinc-600" />
        ) : (
          <ChevronDown size={12} className="text-zinc-600" />
        )}
      </button>

      {expanded && (
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-800/30">
          <p className="text-xs text-zinc-400 leading-relaxed">
            {result.fitExplanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center gap-2">
        {result.status !== "accepted" && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCircle2}
            onClick={handleAccept}
            className="text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300"
          >
            Accept
          </Button>
        )}
        {result.status !== "rejected" && (
          <Button
            variant="outline"
            size="sm"
            icon={XCircle}
            onClick={handleReject}
            className="text-red-400 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
          >
            Reject
          </Button>
        )}
        {result.status !== "cant_reach" && (
          <Button
            variant="ghost"
            size="sm"
            icon={PhoneOff}
            onClick={handleCantReach}
          >
            Can't Reach
          </Button>
        )}
        {result.status !== "pending" && (
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleRestart}
          >
            Reset
          </Button>
        )}

        {/* Call date picker — shown when accepted */}
        {result.status === "accepted" && (
          <div className="ml-auto flex items-center gap-2">
            <CalendarDays size={13} className="text-emerald-500 shrink-0" />
            <input
              type="date"
              value={callDate}
              onChange={handleDateChange}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-1 text-xs text-zinc-200 outline-none focus:border-emerald-500 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
}
