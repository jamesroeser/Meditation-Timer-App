/**
 * Timer Input Component
 *
 * Input field for setting the meditation timer duration.
 * Includes validation, error handling, and mobile-friendly design.
 *
 * Features:
 * - Number input with 1-999 minute range validation
 * - Touch-friendly design for mobile devices
 * - Real-time validation with error messages
 * - Accessible with proper labels and ARIA attributes
 * - Integrates with timer hook for state management
 */

'use client'

import React, { useState, useCallback } from 'react'
import type { TimerInputProps } from '@/types/timer'

/**
 * Timer Input Component
 */
export function TimerInput({
  value,
  onChange,
  disabled = false,
  className = '',
  error,
  min = 1,
  max = 999
}: TimerInputProps) {
  const [inputValue, setInputValue] = useState(value.toString())
  const [isFocused, setIsFocused] = useState(false)

  // Handle input change with validation
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    
    // Allow empty input while typing
    if (newValue === '') {
      setInputValue('')
      return
    }
    
    // Only allow numeric input
    if (!/^\d+$/.test(newValue)) {
      return
    }
    
    const numValue = parseInt(newValue, 10)
    
    // Update input value immediately for responsive UI
    setInputValue(newValue)
    
    // Validate and update parent state
    if (numValue >= min && numValue <= max) {
      onChange(numValue)
    }
  }, [onChange, min, max])

  // Handle blur - ensure we have a valid value
  const handleBlur = useCallback(() => {
    setIsFocused(false)
    
    // If empty or invalid, reset to current value
    if (inputValue === '' || !/^\d+$/.test(inputValue)) {
      setInputValue(value.toString())
      return
    }
    
    const numValue = parseInt(inputValue, 10)
    
    // Clamp to valid range
    if (numValue < min) {
      setInputValue(min.toString())
      onChange(min)
    } else if (numValue > max) {
      setInputValue(max.toString())
      onChange(max)
    }
  }, [inputValue, value, onChange, min, max])

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  // Handle key press for better UX
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1) {
      return
    }
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey === true) {
      return
    }
    
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault()
    }
  }, [])

  // Determine if input has error
  const hasError = Boolean(error) || (inputValue !== '' && (parseInt(inputValue, 10) < min || parseInt(inputValue, 10) > max))

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {/* Label */}
      <label 
        htmlFor="timer-duration" 
        className="text-sm font-medium text-foreground"
      >
        Duration (minutes)
      </label>
      
      {/* Input Field */}
      <div className="relative">
        <input
          id="timer-duration"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyPress}
          disabled={disabled}
          className={`
            w-full rounded-lg border px-4 py-3 text-center text-lg font-medium
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted
            ${hasError 
              ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-border bg-background text-foreground hover:border-primary/50'
            }
            ${isFocused ? 'ring-2 ring-primary ring-offset-2' : ''}
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
          placeholder="15"
          min={min}
          max={max}
          aria-invalid={hasError}
          aria-describedby={hasError ? 'timer-duration-error' : 'timer-duration-help'}
        />
        
        {/* Minutes suffix */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          min
        </div>
      </div>
      
      {/* Help text or error message */}
      <div className="min-h-[20px]">
        {hasError ? (
          <p 
            id="timer-duration-error" 
            className="text-sm text-red-600 flex items-center space-x-1"
            role="alert"
          >
            <span>⚠️</span>
            <span>
              {error || `Please enter a number between ${min} and ${max} minutes`}
            </span>
          </p>
        ) : (
          <p 
            id="timer-duration-help" 
            className="text-sm text-muted-foreground"
          >
            Enter a duration between {min} and {max} minutes
          </p>
        )}
      </div>
    </div>
  )
}

export default TimerInput