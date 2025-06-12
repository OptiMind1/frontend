export function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded border ${className}`}
    >
      {children}
    </button>
  );
}
