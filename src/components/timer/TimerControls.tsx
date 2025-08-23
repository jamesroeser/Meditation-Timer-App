/**
 * Timer Controls Component
 *
 * Control buttons for the meditation timer (start/pause/stop/reset).
 * Provides touch-friendly buttons with visual state feedback.
 *
 * Features:
 * - Large, touch-friendly control buttons
 * - Visual state indication with icons and colors
 * - Disabled states for unavailable actions
 * - Accessible button labels and keyboard support
 * - Smooth hover and active state transitions
 * - Mobile-responsive design
 */

'use client'

import React from 'react'
import type { TimerControlsProps } from '@/types/timer'
import { TimerState } from '@/types/timer'

/**
 * Individual Control Button Component
 */
interface ControlButtonProps {
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
  children: React.ReactNode
  'aria-label': string
}

function ControlButton({
  onClick,
  disabled = false,
  variant = 'secondary',
  className = '',
  children,
  'aria-label': ariaLabel
}: ControlButtonProps) {
  const getVariantClasses = () => {
    if (disabled) {
      return 'bg-muted text-muted-foreground cursor-not-allowed border-muted'
    }
    
    switch (variant) {
      case 'primary':
        return `
          bg-primary text-primary-foreground border-primary
          hover:bg-primary/90 active:bg-primary/80
          shadow-lg hover:shadow-xl active:shadow-md
          ring-primary focus:ring-2 focus:ring-offset-2
        `
      case 'danger':
        return `
          bg-red-600 text-white border-red-600
          hover:bg-red-700 active:bg-red-800
          shadow-lg hover:shadow-xl active:shadow-md
          ring-red-500 focus:ring-2 focus:ring-offset-2
        `
      case 'secondary':
      default:
        return `
          bg-background text-foreground border-border
          hover:bg-muted active:bg-muted/80
          shadow-md hover:shadow-lg active:shadow-sm
          ring-primary focus:ring-2 focus:ring-offset-2
        `
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        flex items-center justify-center rounded-full border
        p-4 text-lg font-medium transition-all duration-200 ease-in-out
        focus:outline-none min-w-[64px] min-h-[64px]
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

/**
 * Timer Controls Component
 */
export function TimerControls({
  state,
  onStart,
  onPause,
  onStop,
  onReset,
  disabled = false,
  className = ''
}: TimerControlsProps) {
  
  // Determine which buttons to show based on state
  const showStart = state === TimerState.READY || state === TimerState.PAUSED
  const showPause = state === TimerState.RUNNING
  const showStop = state === TimerState.RUNNING || state === TimerState.PAUSED
  const showReset = state !== TimerState.READY
  
  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {/* Start/Resume Button */}
      {showStart && (
        <ControlButton
          onClick={onStart}
          disabled={disabled}
          variant="primary"
          aria-label={state === TimerState.PAUSED ? 'Resume timer' : 'Start timer'}
          className="text-2xl"
        >
          {state === TimerState.PAUSED ? (
            <span role="img" aria-hidden="true">▶️</span>
          ) : (
            <span role="img" aria-hidden="true">▶️</span>
          )}
        </ControlButton>
      )}
      
      {/* Pause Button */}
      {showPause && (
        <ControlButton
          onClick={onPause}
          disabled={disabled}
          variant="secondary"
          aria-label="Pause timer"
          className="text-2xl"
        >
          <span role="img" aria-hidden="true">⏸️</span>
        </ControlButton>
      )}
      
      {/* Stop Button */}
      {showStop && (
        <ControlButton
          onClick={onStop}
          disabled={disabled}
          variant="danger"
          aria-label="Stop timer"
          className="text-2xl"
        >
          <span role="img" aria-hidden="true">⏹️</span>
        </ControlButton>
      )}
      
      {/* Reset Button */}
      {showReset && (
        <ControlButton
          onClick={onReset}
          disabled={disabled}
          variant="secondary"
          aria-label="Reset timer"
          className="text-lg"
        >
          <span role="img" aria-hidden="true">🔄</span>
        </ControlButton>
      )}
      
      {/* Completion state message */}
      {state === TimerState.COMPLETED && (
        <div className="text-center">
          <div className="text-lg font-medium text-green-600 mb-2">
            🧘 Meditation Complete!
          </div>
          <div className="text-sm text-muted-foreground">
            Well done on your practice
          </div>
        </div>
      )}
    </div>
  )
}

export default TimerControls