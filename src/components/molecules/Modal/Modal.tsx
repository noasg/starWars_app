// A custom modal container that displays content over the main UI.
// Includes a close button and supports accessibility attributes.

import CloseButton from "../../atoms/CloseButton/CloseButton";
import "./Modal.scss";

export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <CloseButton onClick={onClose} ariaLabel="Close modal" />
      {children}
    </div>
  );
}
