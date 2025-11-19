// A reusable button component for pagination, navigation, Login, Logout, etc.
// Inherits all standard HTML button attributes (like onClick, disabled, type, etc.).
// Children are rendered inside the button, allowing custom text or elements.

import React from "react";
import "./PaginationButton.scss";

interface PaginationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PaginationButton({
  children,
  ...props
}: PaginationButtonProps) {
  return (
    <button className="btn" {...props}>
      {children}
    </button>
  );
}
