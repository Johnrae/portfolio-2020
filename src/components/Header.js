import React, { useEffect, useState, Suspense, useRef } from 'react'
import { Canvas, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  SSAO,
} from 'react-postprocessing'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  OrbitControls,
  Stars,
  Sphere,
  Text,
  MeshDistortMaterial,
  Icosahedron,
  Plane,
} from 'drei'
import { RenderPass, BlendFunction } from 'postprocessing'

const Loader = ({ position = [0, 0, 0], animated = false }) => {
  const mesh = useRef()
  const mat = useRef()

  useFrame(() => {
    if (animated) {
      mesh.current.rotation.x = mesh.current.rotation.y += random(0, 0.01)
    }
  })

  return (
    <Sphere castShadow ref={mesh} args={[1, 100, 100]} position={position}>
      <MeshDistortMaterial
        ref={mat}
        computeVertexNormals
        castShadow
        attach="material"
        color={'hotpink'}
        distort={0.7} // Strength, 0 disables the effect (default=1)
        speed={4} // Speed (default=1)
      />
      {/* <meshLambertMaterial castShadow color="hotpink" attach="material" /> */}
    </Sphere>
  )
}

function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min
}

function randomPosition(min = -20, max = 20) {
  return [random(min, max), random(min, max), random(min, max)]
}

const Orbiters = () => {
  const group = useRef()

  useFrame(({ clock: { elapsedTime: clock } }) => {
    group.current.rotation.x = group.current.rotation.y += 0.01
  })

  return (
    <group ref={group}>
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
      <Loader animated position={randomPosition()} />
    </group>
  )
}

const Mercury = () => {
  const [model, set] = useState()
  useEffect(() => {
    new GLTFLoader().load('/scene.gltf', set)
  }, [])

  return <Loader />
}

const Header = () => {
  const isBrowser = typeof window !== 'undefined'

  return (
    <div style={{ backgroundColor: 'lavender' }}>
      {isBrowser && (
        <Canvas
          style={{ height: '100vh', width: '100vw' }}
          camera={{ position: [0, 0, 3] }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[-10, 10, 20]} penumbra={1} intensity={0.9} />
          <pointLight position={[10, -10, -10]} intensity={0.9} />
          <Suspense fallback={null}>
            <Loader />
            <Mercury />
            <Plane
              args={[200, 200]}
              position={[0, 0, -30]}
              rotation={[0, 0, 0.5]}
            >
              <meshBasicMaterial attach="material" color="lavender" />
            </Plane>

            <EffectComposer>
              <DepthOfField
                focusDistance={0.0}
                focalLength={0.05}
                bokehScale={3}
                blendFunction={BlendFunction.NORMAL}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}

export default Header
