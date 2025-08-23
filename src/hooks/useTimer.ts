/**
 * useTimer Hook
 *
 * Custom React hook that manages meditation timer state and logic.
 * Provides accurate timing, state management, and control methods
 * for the meditation timer functionality.
 *
 * Features:
 * - Accurate second-by-second countdown
 * - State management (ready, running, paused, completed)
 * - Control methods (start, pause, stop, reset)
 * - Progress tracking and formatted display
 * - Automatic cleanup on unmount
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { TimerState, TimerDisplay, TimerHook, TimerConfig } from '@/types/timer'

/**
 * Format seconds into human-readable time string
 * Returns MM:SS format for < 60 minutes, HH:MM:SS for >= 60 minutes
 */
function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Create timer display object from current time state
 */
function createTimerDisplay(
  remainingSeconds: number,
  totalSeconds: number
): TimerDisplay {
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0

  return {
    formatted: formatTime(remainingSeconds),
    minutes,
    seconds,
    totalSeconds: remainingSeconds,
    progress: Math.min(100, Math.max(0, progress))
  }
}

/**
 * Main useTimer Hook
 */
export function useTimer(config: TimerConfig): TimerHook {
  // State management
  const [state, setState] = useState<TimerState>(TimerState.READY)
  const [totalDuration, setTotalDuration] = useState(config.initialMinutes * 60)
  const [remainingTime, setRemainingTime] = useState(config.initialMinutes * 60)
  
  // Refs for interval management and callbacks
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)

  // Create display object
  const display = createTimerDisplay(remainingTime, totalDuration)

  // Computed state values
  const isRunning = state === TimerState.RUNNING
  const isPaused = state === TimerState.PAUSED
  const isCompleted = state === TimerState.COMPLETED
  const isReady = state === TimerState.READY

  // Button availability
  const canStart = state === TimerState.READY || state === TimerState.PAUSED
  const canPause = state === TimerState.RUNNING
  const canStop = state === TimerState.RUNNING || state === TimerState.PAUSED
  const canReset = state !== TimerState.READY

  // Clear any running interval
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Start the timer
  const start = useCallback(() => {
    if (remainingTime <= 0) return

    setState(TimerState.RUNNING)
    startTimeRef.current = Date.now() - pausedTimeRef.current
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newRemainingTime = Math.max(0, totalDuration - Math.floor(elapsed / 1000))
      
      setRemainingTime(newRemainingTime)
      
      // Call onTick callback if provided
      if (config.onTick) {
        config.onTick(newRemainingTime)
      }
      
      // Check for completion
      if (newRemainingTime <= 0) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setState(TimerState.COMPLETED)
        pausedTimeRef.current = 0
        
        // Call onComplete callback if provided
        if (config.onComplete) {
          config.onComplete()
        }
        
        // Auto-reset if configured
        if (config.autoReset) {
          setTimeout(() => {
            setRemainingTime(totalDuration)
            setState(TimerState.READY)
          }, 1000)
        }
      }
    }, 100) // Update every 100ms for smooth UI updates
  }, [remainingTime, totalDuration, config, clearTimerInterval])

  // Pause the timer
  const pause = useCallback(() => {
    if (state !== TimerState.RUNNING) return
    
    clearTimerInterval()
    setState(TimerState.PAUSED)
    pausedTimeRef.current = Date.now() - startTimeRef.current
  }, [state, clearTimerInterval])

  // Stop the timer (reset to original duration)
  const stop = useCallback(() => {
    clearTimerInterval()
    setRemainingTime(totalDuration)
    setState(TimerState.READY)
    pausedTimeRef.current = 0
  }, [clearTimerInterval, totalDuration])

  // Reset the timer (reset to original duration)
  const reset = useCallback(() => {
    clearTimerInterval()
    setRemainingTime(totalDuration)
    setState(TimerState.READY)
    pausedTimeRef.current = 0
  }, [clearTimerInterval, totalDuration])

  // Set new duration (only when not running)
  const setDuration = useCallback((minutes: number) => {
    if (state === TimerState.RUNNING) return
    
    const newDuration = Math.max(60, Math.min(59940, minutes * 60)) // 1-999 minutes
    setTotalDuration(newDuration)
    setRemainingTime(newDuration)
    setState(TimerState.READY)
    pausedTimeRef.current = 0
  }, [state])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimerInterval()
    }
  }, [clearTimerInterval])

  return {
    // State
    state,
    display,
    isRunning,
    isPaused,
    isCompleted,
    isReady,
    
    // Actions
    start,
    pause,
    stop,
    reset,
    setDuration,
    
    // Computed values
    canStart,
    canPause,
    canStop,
    canReset
  }
}