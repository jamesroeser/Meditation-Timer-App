/**
 * Timer Display Component
 *
 * Large, readable countdown display for the meditation timer.
 * Shows formatted time with visual progress indication.
 *
 * Features:
 * - Large, easily readable time display
 * - MM:SS format (< 60 min) or HH:MM:SS format (>= 60 min)
 * - Visual progress ring around the time
 * - State-aware styling (ready, running, paused, completed)
 * - Responsive sizing for different screen sizes
 * - Smooth transitions and animations
 */

'use client'

import React from 'react'
import type { TimerDisplayProps } from '@/types/timer'
import { TimerState } from '@/types/timer'

/**
 * Timer Display Component
 */
export function TimerDisplay({
  display,
  state,
  className = '',
  size = 'lg'
}: TimerDisplayProps) {
  
  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-32 h-32',
          text: 'text-2xl',
          ring: 'w-32 h-32',
          strokeWidth: 4
        }
      case 'md':
        return {
          container: 'w-48 h-48',
          text: 'text-4xl',
          ring: 'w-48 h-48',
          strokeWidth: 6
        }
      case 'lg':
      default:
        return {
          container: 'w-64 h-64 md:w-80 md:h-80',
          text: 'text-4xl md:text-6xl',
          ring: 'w-64 h-64 md:w-80 md:h-80',
          strokeWidth: 8
        }
    }
  }
  
  const sizeClasses = getSizeClasses()
  
  // Get state-specific styling
  const getStateClasses = () => {
    switch (state) {
      case TimerState.RUNNING:
        return {
          text: 'text-primary',
          ring: 'text-primary',
          background: 'text-primary/20',
          glow: 'shadow-lg shadow-primary/20'
        }
      case TimerState.PAUSED:
        return {
          text: 'text-orange-600',
          ring: 'text-orange-500',
          background: 'text-orange-200',
          glow: 'shadow-lg shadow-orange-500/20'
        }
      case TimerState.COMPLETED:
        return {
          text: 'text-green-600',
          ring: 'text-green-500',
          background: 'text-green-200',
          glow: 'shadow-lg shadow-green-500/20 animate-pulse'
        }
      case TimerState.READY:
      default:
        return {
          text: 'text-muted-foreground',
          ring: 'text-muted-foreground',
          background: 'text-muted/20',
          glow: ''
        }
    }
  }
  
  const stateClasses = getStateClasses()
  
  // Calculate circle properties for progress ring
  const radius = size === 'sm' ? 58 : size === 'md' ? 90 : 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (display.progress / 100) * circumference
  
  // Animation classes based on state
  const getAnimationClasses = () => {
    switch (state) {
      case TimerState.RUNNING:
        return 'animate-pulse'
      case TimerState.COMPLETED:
        return 'animate-bounce'
      default:
        return ''
    }
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Progress Ring Background */}
      <svg
        className={`${sizeClasses.ring} -rotate-90 transform`}
        viewBox="0 0 240 240"
      >
        {/* Background circle */}
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke="currentColor"
          strokeWidth={sizeClasses.strokeWidth}
          fill="none"
          className={stateClasses.background}
        />
        
        {/* Progress circle */}
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke="currentColor"
          strokeWidth={sizeClasses.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${stateClasses.ring} transition-all duration-300 ease-in-out`}
          style={{
            transition: 'stroke-dashoffset 0.3s ease-in-out'
          }}
        />
      </svg>
      
      {/* Time Display */}
      <div 
        className={`
          absolute inset-0 flex flex-col items-center justify-center
          ${stateClasses.glow}
        `}
      >
        {/* Main time display */}
        <div 
          className={`
            font-mono font-bold tabular-nums tracking-wide
            ${sizeClasses.text} ${stateClasses.text}
            transition-all duration-300 ease-in-out
            ${getAnimationClasses()}
          `}
        >
          {display.formatted}
        </div>
        
        {/* State indicator */}
        <div className="mt-2 text-xs uppercase font-medium tracking-wider opacity-75">
          <span className={`${stateClasses.text} transition-colors duration-300`}>
            {state === TimerState.READY && 'Ready'}
            {state === TimerState.RUNNING && 'Meditating'}
            {state === TimerState.PAUSED && 'Paused'}
            {state === TimerState.COMPLETED && 'Complete! 🧘'}
          </span>
        </div>
      </div>
      
      {/* Subtle background glow effect */}
      {state === TimerState.RUNNING && (
        <div 
          className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.2)'
          }}
        />
      )}
    </div>
  )
}

export default TimerDisplay