import React, { useState } from "react";
import { User as UserIcon } from "lucide-react";
import { getMediaUrl } from "@/lib/api";

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function UserAvatar({
  src,
  name,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const [error, setError] = useState(false);

  const initial = (name ? name.trim().charAt(0) : "U").toUpperCase();

  const sizeClasses = {
    sm: "h-8 w-8 text-xs rounded-full",
    md: "h-10 w-10 text-sm rounded-full",
    lg: "h-12 w-12 text-base rounded-2xl",
    xl: "h-16 w-16 text-xl rounded-3xl",
  };

  const resolvedUrl = src ? getMediaUrl(src) : null;

  if (resolvedUrl && !error) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-muted border border-border/80 flex items-center justify-center ${sizeClasses[size]} ${className}`}
      >
        <img
          src={resolvedUrl}
          alt={name || "User Avatar"}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 flex items-center justify-center font-bold bg-primary/10 text-primary border border-primary/20 shadow-sm ${sizeClasses[size]} ${className}`}
      title={name || "User"}
    >
      {initial || <UserIcon className="h-1/2 w-1/2 text-primary" />}
    </div>
  );
}
