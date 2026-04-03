'use client'
import { useMemo } from 'react'
import * as THREE from 'three'
import { GLOBE_RADIUS } from './globe-utils'

/**
 * Fibonacci-sphere point cloud — the globe body.
 * Uses warm taupe / dark-brown tones to match PPM brand palette.
 * Land vs ocean is approximated with a trig noise function.
 */
export default function GlobeParticles({
  count  = 2000,
  radius = GLOBE_RADIUS,
}: {
  count?:  number
  radius?: number
}) {
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const cLand  = new THREE.Color('#8a7b6d') // warm taupe — PPM brand mid-tone
    const cOcean = new THREE.Color('#28201a') // very dark warm brown

    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(-1 + (2 * i) / count)
      const theta = Math.sqrt(count * Math.PI) * phi

      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      pos[i * 3]     = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      // Approximate land / ocean distribution via trig noise
      const isLand = Math.sin(x * 1.8) * Math.cos(y * 1.8) + Math.sin(z * 2.1) > 0.24

      const c = isLand ? cLand : cOcean
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
    return geo
  }, [count, radius])

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.026}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
