'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SOURCE_CITIES, MELBOURNE } from './globe-utils'

/**
 * A gently pulsing sphere mesh at a fixed position on the globe surface.
 * Melbourne uses a larger gold node; source cities use smaller warm-white nodes.
 */
function PulsingNode({
  position,
  size,
  color,
  phase,
}: {
  position: THREE.Vector3
  size:     number
  color:    string
  phase:    number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    // Scale pulses between 0.72× and 1.28× — subtle, not distracting
    const s = 1 + 0.28 * Math.sin(t * 2.2 + phase)
    ref.current.scale.setScalar(Math.max(0.01, s))
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  )
}

export default function CityNodes() {
  return (
    <group>
      {/* Melbourne — larger, warm gold destination node */}
      <PulsingNode
        position={MELBOURNE}
        size={0.055}
        color="#c8a96e"
        phase={0}
      />
      {/* Asia-Pacific source cities — smaller, warm off-white */}
      {SOURCE_CITIES.map((city, i) => (
        <PulsingNode
          key={city.name}
          position={city.pos}
          size={0.03}
          color="#d9c9b4"
          phase={(i + 1) * 1.15}
        />
      ))}
    </group>
  )
}
