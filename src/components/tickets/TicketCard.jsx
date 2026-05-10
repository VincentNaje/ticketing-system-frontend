/** Lightweight container for ticket summaries (optional reuse across staff/admin views). */
export default function TicketCard({ title, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${className}`}>
      {title ? <h3 className="font-semibold text-gray-800 mb-2">{title}</h3> : null}
      {children}
    </div>
  );
}
