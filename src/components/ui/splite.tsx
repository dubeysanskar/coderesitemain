
'use client'

import { Suspense, lazy, memo } from 'react'

// Simple fallback component
const SplineFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-lg">
    <div className="text-center">
      <div className="text-6xl mb-4 opacity-20">🤖</div>
      <p className="text-white/70">3D Scene Unavailable</p>
    </div>
  </div>
)

// Simplified lazy loading with proper error handling
const Spline = lazy(() => 
  import('@splinetool/react-spline')
    .then(module => ({ default: module.default }))
    .catch(() => ({ default: SplineFallback }))
)

interface SplineSceneProps {
  scene: string
  className?: string
}

export const SplineScene = memo(function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-20">🤖</div>
            <p className="text-white/70">Loading 3D Scene...</p>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        style={{ 
          pointerEvents: 'auto',
          willChange: 'transform'
        }}
      />
    </Suspense>
  )
})
