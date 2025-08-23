/**
 * Meditation Timer Component
 *
 * Main timer component that combines input, display, and controls.
 * Provides the complete meditation timer experience with state management.
 *
 * Features:
 * - Complete timer functionality (input, countdown, controls)
 * - State management with useTimer hook
 * - Responsive design for mobile and desktop
 * - Accessible with proper ARIA labels and keyboard support
 * - Visual feedback for all timer states
 * - Sound notifications (optional)
 * - Clean, meditative design focused on simplicity
 */

'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { TimerInput } from './TimerInput'
import { TimerDisplay } from './TimerDisplay'
import { TimerControls } from './TimerControls'
import type { TimerConfig } from '@/types/timer'

/**
 * Meditation Timer Props
 */
interface MeditationTimerProps {
  initialDuration?: number // Initial duration in minutes
  className?: string
  onComplete?: () => void // Callback when timer completes
  autoReset?: boolean // Whether to auto-reset after completion
}

/**
 * Main Meditation Timer Component
 */
export function MeditationTimer({
  initialDuration = 15,
  className = '',
  onComplete,
  autoReset = false
}: MeditationTimerProps) {
  const [duration, setDuration] = useState(initialDuration)
  
  // Timer configuration
  const timerConfig: TimerConfig = {
    initialMinutes: duration,
    autoReset,
    onComplete: useCallback(() => {
      if (onComplete) {
        onComplete()
      }
      
      // Optional: Play completion sound
      // This could be implemented later with the Web Audio API
      console.log('🧘 Meditation session completed!')
    }, [onComplete])
  }
  
  // Initialize timer hook
  const timer = useTimer(timerConfig)
  
  // Handle duration change from input
  const handleDurationChange = useCallback((newDuration: number) => {
    setDuration(newDuration)
    timer.setDuration(newDuration)
  }, [timer])
  
  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle shortcuts when not focused on input elements
      if (event.target instanceof HTMLInputElement) {
        return
      }
      
      switch (event.code) {
        case 'Space':
          event.preventDefault()
          if (timer.canStart) {
            timer.start()
          } else if (timer.canPause) {
            timer.pause()
          }
          break
        case 'Escape':
          event.preventDefault()
          if (timer.canStop) {
            timer.stop()
          }
          break
        case 'KeyR':
          event.preventDefault()
          if (timer.canReset) {
            timer.reset()
          }
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [timer])
  
  return (
    <div className={`flex flex-col items-center space-y-8 py-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Meditation Timer
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Set your intention, breathe deeply, and find your center
        </p>
      </div>
      
      {/* Timer Input - only show when ready */}
      {timer.isReady && (
        <div className="w-full max-w-sm">
          <TimerInput
            value={duration}
            onChange={handleDurationChange}
            disabled={timer.isRunning}
            className="w-full"
          />
        </div>
      )}
      
      {/* Timer Display */}
      <div className="flex-1 flex items-center justify-center min-h-[320px]">
        <TimerDisplay
          display={timer.display}
          state={timer.state}
          size="lg"
          className="mx-auto"
        />
      </div>
      
      {/* Timer Controls */}
      <TimerControls
        state={timer.state}
        onStart={timer.start}
        onPause={timer.pause}
        onStop={timer.stop}
        onReset={timer.reset}
        className="w-full max-w-md"
      />
      
      {/* Keyboard Shortcuts Help */}
      {!timer.isRunning && (
        <div className="text-center text-sm text-muted-foreground max-w-md">
          <p className="mb-2 font-medium">Keyboard Shortcuts:</p>
          <div className="space-y-1">
            <p><kbd className="px-2 py-1 bg-muted rounded">Space</kbd> Start/Pause</p>
            <p><kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> Stop</p>
            <p><kbd className="px-2 py-1 bg-muted rounded">R</kbd> Reset</p>
          </div>
        </div>
      )}
      
      {/* Meditation Tips */}
      {timer.isRunning && (
        <div className="text-center text-muted-foreground max-w-md space-y-2">
          <p className="text-sm font-medium">Focus on your breath</p>
          <p className="text-xs opacity-75">
            Notice your thoughts without judgment, then gently return to your breath
          </p>
        </div>
      )}
    </div>
  )
}

export default MeditationTimer