import React, { useEffect, useState, Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { EffectComposer, DepthOfField, SSAO, Bloom } from 'react-postprocessing'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  OrbitControls,
  Stars,
  Sphere,
  Text,
  MeshDistortMaterial,
  Icosahedron,
  Plane as dPlane,
} from 'drei'
import { RenderPass, BlendFunction } from 'postprocessing'
import { Physics, usePlane, useSphere } from '@react-three/cannon'
import niceColors from 'nice-color-palettes'

function Mouse() {
  const { viewport } = useThree()
  const [, api] = useSphere(() => ({ type: 'Kinematic', args: 6 }))
  return useFrame((state) =>
    api.position.set(
      -(state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      7,
    ),
  )
}

function Borders() {
  const { viewport } = useThree()
  return (
    <>
      <Plane
        position={[0, -viewport.height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Plane
        position={[-viewport.width / 2 - 1, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Plane
        position={[viewport.width / 2 + 1, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Plane position={[0, 0, 0]} rotation={[0, 0, 0]} />
      <Plane position={[0, 0, 12]} rotation={[0, -Math.PI, 0]} />
    </>
  )
}

function Plane({ color, ...props }) {
  const [ref] = usePlane(() => ({ ...props }))
  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color={color} />
    </mesh>
  )
}

function InstancedSpheres({ number = 100 }) {
  const [ref] = useSphere((index) => ({
    mass: 100,
    position: [Math.random() - 0.5, index * 2, Math.random() - 0.5],
    args: 1,
  }))

  const colors = useMemo(() => {
    const array = new Float32Array(number * 3)
    const color = new THREE.Color()
    for (let i = 0; i < number; i++)
      color
        .set(niceColors[12][Math.floor(Math.random() * 5)])
        .convertSRGBToLinear()
        .toArray(array, i * 3)
    return array
  }, [number])

  return (
    <instancedMesh
      ref={ref}
      castShadow
      receiveShadow
      args={[null, null, number]}
    >
      <sphereBufferGeometry attach="geometry" args={[1, 16, 16]}>
        <instancedBufferAttribute
          attachObject={['attributes', 'color']}
          args={[colors, 3]}
        />
      </sphereBufferGeometry>
      <meshPhongMaterial attach="material" vertexColors={THREE.VertexColors} />
    </instancedMesh>
  )
}

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

const Header = () => {
  const isBrowser = typeof window !== 'undefined'
  const AO = { samples: 3, luminanceInfluence: 0.6, radius: 2, intensity: 5 }

  return (
    <div style={{ backgroundColor: 'lavender' }}>
      {isBrowser && (
        <Canvas
          style={{ height: '100vh', width: '100vw' }}
          camera={{ position: [0, 0, -10], fov: 50, near: 5, far: 50 }}
          concurrent
          shadowMap
          sRGB
          gl={{ alpha: false }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[-10, 10, 20]} penumbra={1} intensity={0.9} />
          <pointLight position={[10, -10, -10]} intensity={0.9} />
          <Physics>
            <Suspense fallback={null}>
              <Mouse />
              <Borders />
              {/* <Loader /> */}
              <InstancedSpheres />

              <EffectComposer>
                <SSAO
                  {...AO}
                  samples={21}
                  radius={7}
                  intensity={20}
                  luminanceInfluence={0.6}
                  color="black"
                />
                <SSAO {...AO} />
                <Bloom
                  luminanceThreshold={0.85}
                  luminanceSmoothing={0}
                  height={300}
                  opacity={3}
                />
              </EffectComposer>
            </Suspense>
          </Physics>
        </Canvas>
      )}
    </div>
  )
}

export default Header
