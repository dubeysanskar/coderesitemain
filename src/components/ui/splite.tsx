
'use client'

import { Suspense, lazy } from 'react'

// Simple lazy loading without error handling that causes TypeScript issues
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">🤖</div>
            <p className="text-white/70">3D Scene Loading...</p>
          </div>
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
