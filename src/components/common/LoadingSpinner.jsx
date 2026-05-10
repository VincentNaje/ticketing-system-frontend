export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-500 text-sm">
      <div
        className="h-8 w-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}
