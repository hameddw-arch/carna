import type { ReactNode, HTMLAttributes } from 'react';
import { BadgeCheck } from 'lucide-react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'verified' | 'success' | 'warning' | 'error';
  icon?: ReactNode;
}

export function Badge({
  className = '',
  variant = 'default',
  icon,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-150';
  
  const variants = {
    default: 'bg-surface border border-border-light text-text-main',
    verified: 'bg-secondary/10 border border-secondary text-secondary',
    success: 'bg-green-100 border border-green-200 text-green-800',
    warning: 'bg-yellow-100 border border-yellow-200 text-yellow-800',
    error: 'bg-red-100 border border-red-200 text-red-800',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {variant === 'verified' && !icon && <BadgeCheck size={14} className="text-secondary" />}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
