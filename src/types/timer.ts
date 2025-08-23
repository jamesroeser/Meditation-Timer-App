/**
 * Timer Types and Interfaces
 *
 * TypeScript definitions for the meditation timer functionality.
 * These types ensure type safety and provide clear contracts
 * for timer-related components and hooks.
 */

/**
 * Timer State Enum
 * Represents the current state of the meditation timer
 */
export enum TimerState {
  READY = 'ready',       // Timer is ready to start
  RUNNING = 'running',   // Timer is actively counting down
  PAUSED = 'paused',     // Timer is paused
  COMPLETED = 'completed' // Timer has finished
}

/**
 * Timer Configuration Interface
 * Settings for initializing and configuring the timer
 */
export interface TimerConfig {
  initialMinutes: number // Duration in minutes (1-999)
  autoReset?: boolean   // Whether to reset after completion
  onComplete?: () => void // Callback when timer completes
  onTick?: (timeLeft: number) => void // Callback on each second
}

/**
 * Timer Display Interface
 * Formatted time information for UI display
 */
export interface TimerDisplay {
  formatted: string     // Human-readable time string (MM:SS or HH:MM:SS)
  minutes: number      // Remaining minutes
  seconds: number      // Remaining seconds within current minute
  totalSeconds: number // Total remaining seconds
  progress: number     // Progress as percentage (0-100)
}

/**
 * Timer Hook Return Interface
 * All methods and state returned by the useTimer hook
 */
export interface TimerHook {
  // State
  state: TimerState
  display: TimerDisplay
  isRunning: boolean
  isPaused: boolean
  isCompleted: boolean
  isReady: boolean
  
  // Actions
  start: () => void
  pause: () => void
  stop: () => void
  reset: () => void
  setDuration: (minutes: number) => void
  
  // Computed values
  canStart: boolean
  canPause: boolean
  canStop: boolean
  canReset: boolean
}

/**
 * Timer Input Props Interface
 * Props for the timer input component
 */
export interface TimerInputProps {
  value: number
  onChange: (minutes: number) => void
  disabled?: boolean
  className?: string
  error?: string
  min?: number
  max?: number
}

/**
 * Timer Display Props Interface  
 * Props for the timer display component
 */
export interface TimerDisplayProps {
  display: TimerDisplay
  state: TimerState
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Timer Controls Props Interface
 * Props for the timer controls component
 */
export interface TimerControlsProps {
  state: TimerState
  onStart: () => void
  onPause: () => void
  onStop: () => void
  onReset: () => void
  disabled?: boolean
  className?: string
}