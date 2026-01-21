'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Stars() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000 * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 50
      arr[i + 1] = (Math.random() - 0.5) * 50
      arr[i + 2] = (Math.random() - 0.5) * 50
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02
      ref.current.rotation.y -= delta * 0.03
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00F0FF"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function DistantStars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000 * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 100
      arr[i + 1] = (Math.random() - 0.5) * 100
      arr[i + 2] = (Math.random() - 0.5) * 100
    }
    return arr
  }, [])

  return (
    <Points positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FFFFFF"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

export function StarField() {
  return (
    <>
      <Stars />
      <DistantStars />
    </>
  )
}

export function SpaceBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.5} />
        <StarField />
      </Canvas>
    </div>
  )
}
