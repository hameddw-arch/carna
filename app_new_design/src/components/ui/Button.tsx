import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-base font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';
  
  const variants = {
    primary: 'bg-primary text-black hover:bg-primary-dark',
    secondary: 'bg-transparent text-text-main border border-black hover:bg-surface',
    outline: 'bg-transparent text-text-main border border-border-light hover:bg-surface hover:border-text-main',
    ghost: 'bg-transparent text-text-muted hover:text-text-main hover:bg-surface',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-6 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
