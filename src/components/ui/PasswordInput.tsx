"use client";
import React, { useState, forwardRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, onChange, value, wrapperClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    // Sync external value with internal value for changes that don't trigger onChange
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
        if (value === '') {
          setShowPassword(false);
        }
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInternalValue(val);
      if (val.length === 0) {
        setShowPassword(false);
      }
      if (onChange) {
        onChange(e);
      }
    };

    const currentValue = value !== undefined ? value : internalValue;
    const hasValue = String(currentValue || '').length > 0;

    return (
      <div className={twMerge("relative", wrapperClassName)}>
        <input
          {...props}
          value={value}
          ref={ref}
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
          className={twMerge(
            "w-full",
            className,
            "pr-10"
          )}
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
