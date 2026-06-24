'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import GlobeParticles from './GlobeParticles'
import RouteArcs from './RouteArcs'
import CityNodes from './CityNodes'

/**
 * SceneRig
 *
 * Two-layer group:
 *   outerRef — very subtle mouse-pointer tilt (parallax feel, not a demo)
 *   innerRef — continuous slow y-rotation so the globe is always alive
 *
 * Initial y-rotation of Math.PI puts the Asia-Pacific hemisphere facing the
 * camera (which sits at z = 5.5).
 */
function SceneRig({ particleCount }: { particleCount: number }) {
  const outerRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)

  useFrame(({ pointer }) => {
    if (innerRef.current) {
      innerRef.current.rotation.y += 0.0005
    }
    if (outerRef.current) {
      // Lerp factor 0.02 = very lazy follow — never feels interactive/gamey
      outerRef.current.rotation.y = THREE.MathUtils.lerp(
        outerRef.current.rotation.y,
        pointer.x * 0.12,
        0.02
      )
      outerRef.current.rotation.x = THREE.MathUtils.lerp(
        outerRef.current.rotation.x,
        -pointer.y * 0.08,
        0.02
      )
    }
  })

  return (
    <group ref={outerRef}>
      <group ref={innerRef} rotation={[0.22, Math.PI, 0]}>
        <GlobeParticles count={particleCount} />
        <RouteArcs />
        <CityNodes />
      </group>
    </group>
  )
}

/**
 * GlobeCanvas
 *
 * This component is only ever rendered client-side (imported via
 * next/dynamic with ssr: false in OverseasReachSection), so accessing
 * window here is safe — no hydration mismatch risk.
 */
export default function GlobeCanvas() {
  const isMobile     = window.innerWidth < 768
  const particleCount = isMobile ? 700 : 2000
  const dpr           = Math.min(window.devicePixelRatio, 1.5)

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: !isMobile }}
        dpr={[1, dpr]}
      >
        {/* Scene clear colour — matches section bg so fog fades cleanly */}
        <color attach="background" args={['#13100d']} />

        {/*
          Fog near=4 / far=8: the front of the globe (distance ~3.5 from
          camera) stays clear; the far hemisphere fades into the dark bg.
        */}
        <fog attach="fog" args={['#13100d', 4, 8]} />

        <SceneRig particleCount={particleCount} />

        {/* Soft warm glow — lower intensity than a typical "tech demo" */}
        {!isMobile && (
          <EffectComposer enableNormalPass={false}>
            <Bloom
              luminanceThreshold={0.3}
              mipmapBlur
              intensity={0.75}
              radius={0.5}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
