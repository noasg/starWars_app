import "./Backdrop.scss";

export default function Backdrop({ onClick }: { onClick: () => void }) {
  return <div className="backdrop" onClick={onClick} />;
}
