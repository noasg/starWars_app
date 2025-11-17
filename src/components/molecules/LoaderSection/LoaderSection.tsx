import React from "react";
import PersonCardSkeleton from "../PersonCardSkeleton/PersonCardSkeleton";
import "./LoaderSection.scss";

interface LoaderSectionProps {
  count?: number;
}

export default function LoaderSection({ count = 10 }: LoaderSectionProps) {
  return (
    <div className="loader-section">
      {Array.from({ length: count }).map((_, i) => (
        <PersonCardSkeleton key={i} />
      ))}
    </div>
  );
}
