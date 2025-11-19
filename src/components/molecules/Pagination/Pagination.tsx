// Renders "Prev" and "Next" buttons for paginated content.
// Disables buttons based on fetch status or availability of pages.

import PaginationButton from "../../atoms/PaginationButton/PaginationButton";
import "./Pagination.scss";

interface PaginationProps {
  onNext: () => void;
  onPrev: () => void;
  isFetchingNext?: boolean;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function Pagination({
  onNext,
  onPrev,
  isFetchingNext = false,
  hasNext = true,
  hasPrev = true,
}: PaginationProps) {
  return (
    <div className="pagination">
      <PaginationButton onClick={onPrev} disabled={!hasPrev || isFetchingNext}>
        Prev
      </PaginationButton>
      <PaginationButton onClick={onNext} disabled={!hasNext || isFetchingNext}>
        Next
      </PaginationButton>
    </div>
  );
}
