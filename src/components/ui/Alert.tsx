interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onDismiss?: () => void;
}

const typeConfig = {
  success: {
    classes: 'bg-green-50 border-green-200 text-green-800',
    icon: (
      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  error: {
    classes: 'bg-red-50 border-red-200 text-red-800',
    icon: (
      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  info: {
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: (
      <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
  },
};

export function Alert({ type, message, onDismiss }: AlertProps) {
  const config = typeConfig[type];

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 animate-[slideDown_0.3s_ease-out] ${config.classes}`}>
      <span className="flex-shrink-0 mt-px">{config.icon}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 rounded-md p-0.5 text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
