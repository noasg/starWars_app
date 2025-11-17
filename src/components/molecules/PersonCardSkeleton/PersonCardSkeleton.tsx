import "./PersonCardSkeleton.scss";

export default function PersonCardSkeleton() {
  return (
    <div className="person-card-skeleton">
      <div className="person-card-skeleton__image" />
      <div className="person-card-skeleton__name" />
    </div>
  );
}
