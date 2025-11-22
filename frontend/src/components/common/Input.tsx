import React, { InputHTMLAttributes, ReactNode, useState, forwardRef } from 'react';
import './Input.css';

/**
 * Types d'input supportés
 */
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

/**
 * Tailles d'input
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Props du composant Input
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: InputSize;
  isDisabled?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
}

/**
 * Composant Input réutilisable avec support des icônes et états
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      isDisabled = false,
      isRequired = false,
      isReadOnly = false,
      fullWidth = false,
      showPasswordToggle = false,
      className = '',
      id,
      value,
      onChange,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    // Générer un ID unique si non fourni
    const inputId = id || `input-${Math.random().toString(36).substring(7)}`;

    // Déterminer le type réel de l'input
    const inputType = type === 'password' && showPasswordToggle && showPassword ? 'text' : type;

    const containerClasses = [
      'input-container',
      fullWidth ? 'input-container-full-width' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const wrapperClasses = [
      'input-wrapper',
      `input-wrapper-${size}`,
      isFocused ? 'input-wrapper-focused' : '',
      error ? 'input-wrapper-error' : '',
      isDisabled ? 'input-wrapper-disabled' : '',
      isReadOnly ? 'input-wrapper-readonly' : '',
      leftIcon ? 'input-wrapper-with-left-icon' : '',
      rightIcon || (type === 'password' && showPasswordToggle) ? 'input-wrapper-with-right-icon' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'input',
      `input-${size}`,
    ]
      .filter(Boolean)
      .join(' ');

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = currentValue && String(currentValue).length > 0;

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {isRequired && <span className="input-required" aria-label="required">*</span>}
          </label>
        )}

        <div className={wrapperClasses}>
          {leftIcon && (
            <span className="input-icon input-icon-left" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClasses}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={isReadOnly}
            required={isRequired}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />

          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              className="input-password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="input-icon-svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="input-icon-svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}

          {rightIcon && !showPasswordToggle && (
            <span className="input-icon input-icon-right" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="input-error" id={`${inputId}-error`} role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="input-helper" id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;