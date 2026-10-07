import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'link-arrow';
type ButtonSize = 'clinic' | 'patient';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'clinic', loading = false, disabled, children, ...props }, ref) => {
    
    let baseStyles = 'inline-flex items-center justify-center font-bold transition-colors focus:outline-none focus:ring-[3px] focus:ring-ink focus:ring-offset-2';
    
    // Radii: pill (999) for nav and buttons
    if (variant === 'primary' || variant === 'secondary') {
      baseStyles += ' rounded-full';
    }

    let sizeStyles = '';
    if (variant !== 'link-arrow') {
      if (size === 'clinic') {
        sizeStyles = 'px-6 py-2 text-[15px] min-h-[40px]';
      } else if (size === 'patient') {
        sizeStyles = 'px-8 py-3 text-[24px] min-h-[56px] min-w-[56px]';
      }
    } else {
      if (size === 'clinic') {
        sizeStyles = 'text-[15px]';
      } else if (size === 'patient') {
        sizeStyles = 'text-[24px]';
      }
    }

    let variantStyles = '';
    if (variant === 'primary') {
      // primary (ink + lime arrow)
      variantStyles = 'bg-ink text-paper hover:bg-muted disabled:bg-gray-300 disabled:text-gray-500';
    } else if (variant === 'secondary') {
      variantStyles = 'bg-paper-dim text-ink hover:bg-gray-200 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400';
    } else if (variant === 'link-arrow') {
      variantStyles = 'text-ink underline hover:no-underline underline-offset-4 decoration-2 disabled:text-gray-400 disabled:no-underline';
    }

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
        {variant === 'primary' && !loading && (
          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-lime text-ink">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        )}
        {variant === 'link-arrow' && !loading && (
          <span className="ml-1 inline-flex items-center text-lime">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
