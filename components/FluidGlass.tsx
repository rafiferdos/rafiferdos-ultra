'use client'

import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

type FluidGlassProps = {
  className?: string
  tint?: string
}

function GlassBody({ tint }: { tint: string }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    easing.dampE(
      ref.current.rotation,
      [state.pointer.y * 0.035, state.pointer.x * 0.055, 0],
      0.2,
      delta
    )
  })

  return (
    <RoundedBox ref={ref} args={[5.8, 1.42, 0.38]} radius={0.34} smoothness={8}>
      <MeshTransmissionMaterial
        transmission={1}
        roughness={0.16}
        thickness={0.72}
        ior={1.18}
        chromaticAberration={0.035}
        anisotropy={0.08}
        distortion={0.12}
        distortionScale={0.18}
        temporalDistortion={0.04}
        color={tint}
        attenuationColor={tint}
        attenuationDistance={1.1}
      />
    </RoundedBox>
  )
}

export default function FluidGlass({
  className,
  tint = '#f8fafc'
}: FluidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && !document.hidden)
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} aria-hidden="true" className={className}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.4], fov: 28 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[-3, 2, 5]} intensity={18} color="#f59e0b" />
        <pointLight position={[3, -1, 4]} intensity={12} color="#8b5cf6" />
        <GlassBody tint={tint} />
      </Canvas>
    </div>
  )
}
