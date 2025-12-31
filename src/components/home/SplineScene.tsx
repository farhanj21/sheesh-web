'use client'

import Spline from '@splinetool/react-spline'

export function SplineScene({ scene }: { scene: string }) {
  return (
    <Spline
      scene={scene}
      style={{ background: 'transparent' }}
      onLoad={(spline) => {
        // Set transparent background on the renderer
        if (spline && spline.renderer) {
          spline.renderer.setClearColor(0x000000, 0)
        }
      }}
    />
  )
}
