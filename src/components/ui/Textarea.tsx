import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    resize = 'vertical', 
    className = '', 
    ...props 
  }, ref) => {
    const id = props.id || props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseClasses = 'w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200';
    const errorClasses = error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-green-dim/30 focus:ring-orange focus:border-orange';
    const resizeClass = `resize-${resize}`;
    const disabledClasses = props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
    
    const textareaClasses = [
      baseClasses,
      errorClasses,
      resizeClass,
      disabledClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className="form-control">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-green-darker mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={textareaClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${id}-error`} role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-sm text-green-dim" id={`${id}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;