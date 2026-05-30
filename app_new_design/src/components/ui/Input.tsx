import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({
  className = '',
  label,
  error,
  fullWidth = true,
  id,
  ...props
}: InputProps) {
  const widthStyle = fullWidth ? 'w-full' : '';
  const errorStyle = error ? 'border-red-600 focus:ring-red-600' : 'border-border-light focus:border-primary focus:ring-1 focus:ring-primary';
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${widthStyle} ${className}`}>
      {label && (
        <label htmlFor={generatedId} className="text-sm font-medium text-text-main text-right">
          {label}
        </label>
      )}
      <input
        id={generatedId}
        className={`bg-white px-3.5 py-3 border rounded-base text-[15px] text-text-main placeholder-text-muted transition-colors duration-150 outline-none ${errorStyle}`}
        {...props}
      />
      {error && <span className="text-sm text-red-600 text-right mt-1">{error}</span>}
    </div>
  );
}
