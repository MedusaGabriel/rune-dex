interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <svg 
            className="h-5 w-5 text-red-400 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
          <p className="text-red-400 text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
