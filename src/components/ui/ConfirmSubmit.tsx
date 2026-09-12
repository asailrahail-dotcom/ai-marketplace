'use client';

// Wraps a server-action form submit button with a native confirm() dialog,
// used everywhere an admin or user action deletes or hides something.
export function ConfirmSubmit({
  confirmText,
  className = 'btn btn-secondary',
  children,
}: {
  confirmText: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
