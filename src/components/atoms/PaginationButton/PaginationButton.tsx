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
