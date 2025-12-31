'use client'

import Spline from '@splinetool/react-spline'

export function SplineScene({ scene }: { scene: string }) {
  return (
    <Spline
      scene={scene}
      style={{ background: 'transparent' }}
    />
  )
}
