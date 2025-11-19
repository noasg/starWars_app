// A simple reusable button to close modals -Character and LoginForm in my case

import "./CloseButton.scss";

interface CloseButtonProps {
  onClick: () => void;
  ariaLabel?: string;
}

export default function CloseButton({
  onClick,
  ariaLabel = "Close",
}: CloseButtonProps) {
  return (
    <button className="close-btn" onClick={onClick} aria-label={ariaLabel}>
      &times;
    </button>
  );
}
