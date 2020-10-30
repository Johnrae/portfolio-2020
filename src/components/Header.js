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
  GodRays,
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
  useCubeTextureLoader,
  Html,
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
  const mesh = useRef()

  useEffect(() => {
    new GLTFLoader().load('/scene.gltf', set)
  }, [])
  const envMap = useCubeTextureLoader(
    ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
    { path: '/cube/' },
  )

  useFrame(() => {
    if (!mesh.current) return
    mesh.current.rotation.y = mesh.current.rotation.x += 0.005
  })

  if (!model) return null
  console.log(model)

  return (
    <primitive
      envMap={envMap}
      ref={mesh}
      scale={[3]}
      object={model.scene}
      position={[-2, 0, -0.5]}
      scale={[3, 3, 3]}
    >
      <MeshDistortMaterial
        ref={mesh}
        computeVertexNormals
        castShadow
        attach="material"
        color={'black'}
        distort={0.7} // Strength, 0 disables the effect (default=1)
        speed={4} // Speed (default=1)
      />
    </primitive>
  )
}

const Content = () => {
  return (
    <Html style={{ color: 'white', width: '500px' }}>
      <h1>John Rae</h1>
      <h2>Web Developer</h2>
    </Html>
  )
}

const Header = () => {
  const isBrowser = typeof window !== 'undefined'
  const sunRef = useRef()

  return (
    <div>
      {isBrowser && (
        <Canvas
          style={{ height: '100vh', width: '100vw' }}
          camera={{ position: [0, 0, 3] }}
          colorManagement
          color={'#111120'}
        >
          <color attach="background" args={['#020201']} />
          <fog color="#161616" attach="fog" near={8} far={30} />
          <ambientLight intensity={1} />
          <pointLight position={[-2, 2, 4]} penumbra={1} intensity={0.9} />
          <pointLight position={[3, -3, -3]} intensity={0.4} />
          <Suspense fallback={null}>
            <Mercury />
            {/* <Plane
              args={[200, 200]}
              position={[0, 0, -30]}
              rotation={[0, 0, 0.5]}
            >
              <meshBasicMaterial attach="material" color="lavender" />
            </Plane> */}
            <Content />

            <EffectComposer>
              <Bloom
                luminanceThreshold={0.7}
                luminanceSmoothing={0.9}
                height={300}
                opacity={3}
              />
              <Noise opacity={0.025} />
              <Vignette eskil={false} offset={0.1} darkness={0.7} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}

export default Header
