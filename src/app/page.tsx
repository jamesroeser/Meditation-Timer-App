/**
 * Home Page Component
 *
 * The main landing page for Meditation Timer App.
 * This provides the core meditation timer interface
 * with simple, gentle controls for mindful practice.
 *
 * Features:
 * - Timer input and controls
 * - Countdown display
 * - Gentle completion notification
 * - Extended session tracking
 * - Mobile-responsive design
 */

import { MeditationTimer } from '@/components/MeditationTimer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            🧘 Meditation Timer
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground sm:text-xl">
            A gentle, non-intrusive timer designed for mindful meditation practice.
            Simple countdown with a soft completion bell and extended session tracking.
          </p>
        </div>
      </section>

      {/* Timer Interface */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <MeditationTimer />
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Mindful Design Features
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Gentle Notification */}
            <div className="text-center">
              <div className="mb-4 text-4xl">🔔</div>
              <h3 className="mb-2 text-xl font-semibold">
                Gentle Bell
              </h3>
              <p className="text-sm text-muted-foreground">
                Single soft bell when your timer completes - no persistent alerts to interrupt your meditation flow
              </p>
            </div>

            {/* Extended Tracking */}
            <div className="text-center">
              <div className="mb-4 text-4xl">⏱️</div>
              <h3 className="mb-2 text-xl font-semibold">
                Extended Sessions
              </h3>
              <p className="text-sm text-muted-foreground">
                Automatically tracks extra time when you continue meditating beyond your planned duration
              </p>
            </div>

            {/* Mobile Ready */}
            <div className="text-center">
              <div className="mb-4 text-4xl">📱</div>
              <h3 className="mb-2 text-xl font-semibold">
                Mobile Optimized
              </h3>
              <p className="text-sm text-muted-foreground">
                Works seamlessly on all devices, even when your screen auto-locks during meditation
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
