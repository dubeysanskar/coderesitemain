'use client'

import React, { memo } from 'react';

interface SplineSceneProps {
  scene: string
  className?: string
}

// Simplified component that shows a beautiful fallback instead of loading Spline
export const SplineScene = memo(function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-lg ${className || ''}`}>
      <div className="text-center relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-green-400/20 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-blue-500/20 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-purple-500/20 rounded-full animate-pulse delay-500" />
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          <div className="text-6xl mb-4 opacity-40 animate-bounce">🤖</div>
          <h3 className="text-white/90 text-lg font-medium mb-2">Interactive 3D Experience</h3>
          <p className="text-white/60 text-sm">Immersive visual content</p>
        </div>
        
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>
    </div>
  );
});
