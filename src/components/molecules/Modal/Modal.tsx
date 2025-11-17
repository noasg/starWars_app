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
      <button className="modal__close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      {children}
    </div>
  );
}
