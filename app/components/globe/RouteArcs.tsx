'use client'
import { useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SOURCE_CITIES, MELBOURNE } from './globe-utils'

/**
 * A single bezier arc from one city to Melbourne.
 * Opacity pulses gently at a city-specific phase so all arcs don't
 * breathe in unison — creates a living, staggered glow effect.
 */
function ArcLine({
  from,
  to,
  phase,
}: {
  from:  THREE.Vector3
  to:    THREE.Vector3
  phase: number
}) {
  const line = useMemo(() => {
    const mid  = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
    const dist = from.distanceTo(to)
    // Push the control point outward from the sphere centre for a clean arc
    const ctrl = mid.clone().normalize().multiplyScalar(mid.length() + dist * 0.4)
    const pts  = new THREE.QuadraticBezierCurve3(from, ctrl, to).getPoints(64)
    const geo  = new THREE.BufferGeometry().setFromPoints(pts)
    const mat  = new THREE.LineBasicMaterial({
      color: 0xc8a96e, // warm amber — PPM accent
      transparent: true,
      opacity: 0.1,
    })
    return new THREE.Line(geo, mat)
  }, [from, to])

  // Dispose GPU resources when the arc unmounts
  useEffect(() => {
    return () => {
      line.geometry.dispose()
      ;(line.material as THREE.Material).dispose()
    }
  }, [line])

  useFrame(({ clock }) => {
    const mat = line.material as THREE.LineBasicMaterial
    const t = clock.getElapsedTime()
    mat.opacity = 0.07 + 0.18 * Math.abs(Math.sin(t * 0.55 + phase))
  })

  return <primitive object={line} />
}

export default function RouteArcs() {
  return (
    <group>
      {SOURCE_CITIES.map((city, i) => (
        <ArcLine
          key={city.name}
          from={city.pos}
          to={MELBOURNE}
          phase={(i / SOURCE_CITIES.length) * Math.PI * 2}
        />
      ))}
    </group>
  )
}
