'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Sparse ambient particle field — very slow upward drift.
 * Warm amber tones, low opacity. Used as a background layer in the
 * dark opening section to add atmospheric depth without distraction.
 */
function DustParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)

  const { geometry, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Scatter randomly across a wide volume in front of the camera
      pos[i * 3]     = (Math.random() - 0.5) * 18
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1

      // Very slow drift — mostly upward, slight horizontal wander
      vel[i * 3]     = (Math.random() - 0.5) * 0.0022
      vel[i * 3 + 1] = Math.random() * 0.0028 + 0.0006
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0012
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { geometry: geo, velocities: vel }
  }, [count])

  useFrame(() => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      pos[i * 3]     += velocities[i * 3]
      pos[i * 3 + 1] += velocities[i * 3 + 1]
      pos[i * 3 + 2] += velocities[i * 3 + 2]

      // Wrap: particles that drift out of bounds re-enter from the opposite side
      if (pos[i * 3 + 1] >  5.5) pos[i * 3 + 1] = -5.5
      if (pos[i * 3]     >  9.5) pos[i * 3]     = -9.5
      if (pos[i * 3]     < -9.5) pos[i * 3]     =  9.5
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.022}
        color="#c8a96e"
        transparent
        opacity={0.38}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * Client-only component — safe to access window directly because it is
 * always imported via next/dynamic with ssr: false.
 */
export default function FloatingDust() {
  const count = window.innerWidth < 768 ? 55 : 130

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* alpha: true makes the canvas background transparent so the
          section's CSS background colour shows through cleanly */}
      <Canvas camera={{ position: [0, 0, 8], fov: 65 }} gl={{ alpha: true }}>
        <DustParticles count={count} />
      </Canvas>
    </div>
  )
}
