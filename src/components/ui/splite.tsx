
'use client'

import { Suspense, lazy } from 'react'

// Lazy load Spline with error boundary
const Spline = lazy(() => 
  import('@splinetool/react-spline').catch(() => ({
    default: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">🤖</div>
          <p className="text-white/70">3D Scene Loading...</p>
        </div>
      </div>
    )
  }))
)

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader text-white">Loading 3D Scene...</span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}
