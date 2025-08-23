'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

type TimerState = 'ready' | 'running' | 'paused' | 'completed'

interface TimerProps {
  className?: string
}

export function MeditationTimer({ className = '' }: TimerProps) {
  const [duration, setDuration] = useState(10) // Duration in minutes
  const [timeLeft, setTimeLeft] = useState(10 * 60) // Time left in seconds
  const [state, setState] = useState<TimerState>('ready')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Format time as MM:SS or HH:MM:SS
  const formatTime = useCallback((seconds: number): string => {
    if (seconds < 0) seconds = 0
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }, [])

  // Update duration and reset timer
  const handleDurationChange = useCallback((newDuration: number) => {
    if (newDuration < 1 || newDuration > 999) return
    
    setDuration(newDuration)
    if (state === 'ready') {
      setTimeLeft(newDuration * 60)
    }
  }, [state])

  // Start timer
  const handleStart = useCallback(() => {
    setState('running')
  }, [])

  // Pause timer
  const handlePause = useCallback(() => {
    setState('paused')
  }, [])

  // Resume timer
  const handleResume = useCallback(() => {
    setState('running')
  }, [])

  // Stop and reset timer
  const handleStop = useCallback(() => {
    setState('ready')
    setTimeLeft(duration * 60)
  }, [duration])

  // Reset to initial state
  const handleReset = useCallback(() => {
    setState('ready')
    setTimeLeft(duration * 60)
  }, [duration])

  // Timer countdown effect
  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setState('completed')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Get status text
  const getStatusText = useCallback(() => {
    switch (state) {
      case 'ready':
        return 'Ready to begin'
      case 'running':
        return 'Meditation in progress...'
      case 'paused':
        return 'Paused - resume when ready'
      case 'completed':
        return 'Session complete 🧘'
      default:
        return 'Ready to begin'
    }
  }, [state])

  return (
    <div className={`mx-auto max-w-md ${className}`}>
      {/* Timer Input */}
      <div className="mb-8 text-center">
        <label className="mb-4 block text-lg font-medium">
          Meditation Duration (minutes)
        </label>
        <input
          type="number"
          min="1"
          max="999"
          value={duration}
          onChange={(e) => handleDurationChange(parseInt(e.target.value) || 1)}
          disabled={state !== 'ready'}
          className="w-32 rounded-lg border border-border bg-background px-4 py-2 text-center text-2xl font-bold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Timer Display */}
      <div className="mb-8 text-center">
        <div className={`text-6xl font-mono font-bold transition-colors duration-300 ${
          state === 'completed' ? 'text-green-600' :
          state === 'running' ? 'text-primary' :
          state === 'paused' ? 'text-yellow-600' :
          'text-primary'
        }`}>
          {formatTime(timeLeft)}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {getStatusText()}
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex justify-center space-x-4">
        {state === 'ready' && (
          <button 
            onClick={handleStart}
            className="rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Start
          </button>
        )}
        
        {state === 'running' && (
          <>
            <button 
              onClick={handlePause}
              className="rounded-lg border border-border px-8 py-3 text-lg font-medium transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Pause
            </button>
            <button 
              onClick={handleStop}
              className="rounded-lg border border-red-200 px-8 py-3 text-lg font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              Stop
            </button>
          </>
        )}
        
        {state === 'paused' && (
          <>
            <button 
              onClick={handleResume}
              className="rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Resume
            </button>
            <button 
              onClick={handleStop}
              className="rounded-lg border border-red-200 px-8 py-3 text-lg font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
            >
              Stop
            </button>
          </>
        )}
        
        {state === 'completed' && (
          <button 
            onClick={handleReset}
            className="rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            New Session
          </button>
        )}
      </div>

      {/* Duration info when timer is running */}
      {(state === 'running' || state === 'paused') && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {duration} minute session
        </div>
      )}
    </div>
  )
}