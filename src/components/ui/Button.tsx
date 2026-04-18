import { LucideIcon } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-amber-500 hover:bg-amber-400 text-black font-semibold border border-amber-500 hover:border-amber-400',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-zinc-600',
  ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-transparent',
  danger: 'bg-red-600 hover:bg-red-500 text-white border border-red-600 hover:border-red-500',
  outline: 'bg-transparent hover:bg-zinc-800/60 text-zinc-300 border border-zinc-700 hover:border-zinc-500',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
    >
      {Icon && iconPosition === 'left' && !loading && <Icon className="shrink-0" size={size === 'sm' ? 13 : 15} />}
      {loading && (
        <span className="shrink-0 inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && !loading && <Icon className="shrink-0" size={size === 'sm' ? 13 : 15} />}
    </button>
  );
}
