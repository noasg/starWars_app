// Displays a section of PersonCardSkeleton loaders to indicate content is loading.
// Useful for showing a placeholder while fetching data (e.g., characters list)

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
