// A placeholder skeleton for a PersonCard.
// Used while loading character data to indicate that content is being fetched
import "./PersonCardSkeleton.scss";

export default function PersonCardSkeleton() {
  return (
    <div className="person-card-skeleton">
      <div className="person-card-skeleton__image" />
      {/* <div className="person-card-skeleton__name" /> */}
    </div>
  );
}
