import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({
  className = '',
  hoverable = false,
  children,
  ...props
}: CardProps) {
  const hoverStyles = hoverable ? 'hover:border-primary transition-colors duration-250 cursor-pointer' : '';
  
  return (
    <div
      className={`bg-white border border-border-light rounded-base overflow-hidden ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-4 md:p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
