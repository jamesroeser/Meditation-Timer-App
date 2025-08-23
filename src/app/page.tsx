/**
 * Home Page Component
 *
 * The main page for the Meditation Timer App.
 * Features the core meditation timer functionality with a clean,
 * focused design that supports mindful practice.
 *
 * Features:
 * - Meditation timer with input, countdown, and controls
 * - Clean, distraction-free interface
 * - Mobile-responsive design
 * - Keyboard shortcuts for accessibility
 */

import { MeditationTimer } from '@/components/timer/MeditationTimer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Main Timer Section */}
      <section className="flex items-center justify-center min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <MeditationTimer 
            initialDuration={15}
            onComplete={() => {
              // Optional: Add analytics or user tracking here
              console.log('Meditation session completed')
            }}
            className="w-full"
          />
        </div>
      </section>
    </main>
  )
}
