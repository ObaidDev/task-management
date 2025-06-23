import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailTagProps {
  email: string;
  isValid?: boolean;
  onRemove?: () => void;
}

const EmailTag = ({
  email = "",
  isValid = true,
  onRemove = () => {},
}: EmailTagProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-sm max-w-[150px] transition-all",
        "border animate-in fade-in-50 zoom-in-95 duration-200",
        isValid
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-800",
      )}
    >
      <span className="truncate">{email}</span>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "rounded-full p-0.5 hover:bg-opacity-20 transition-colors",
          isValid ? "hover:bg-green-200" : "hover:bg-red-200",
        )}
        aria-label={`Remove ${email}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

export default EmailTag;
