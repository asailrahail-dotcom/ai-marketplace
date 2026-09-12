import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantClass: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${variantClass[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  href,
  variant = 'primary',
  className = '',
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${variantClass[variant]} ${className}`}>
      {children}
    </Link>
  );
}
