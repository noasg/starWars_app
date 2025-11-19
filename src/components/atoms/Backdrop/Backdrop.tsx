//This is a simple overlay that covers the screen.
// It is used to detect clicks outside of a modal to close it.
// Same functionality as the close button

import "./Backdrop.scss";

export default function Backdrop({ onClick }: { onClick: () => void }) {
  return <div className="backdrop" onClick={onClick} />;
}
