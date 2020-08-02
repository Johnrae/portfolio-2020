import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, Stars } from 'drei'
import { isBrowser } from 'gatsby'

const Frog = () => {
  const [model, set] = useState()
  useEffect(() => {
    new GLTFLoader().load('/scene.gltf', set)
  }, [])

  if (!model) return null
  console.log(model)

  return (
    <primitive
      object={model.scene}
      position={[0, 0, 0]}
      rotation={[0, 0.8, 0.2]}
      scale={[0.2, 0.2, 0.2]}
    />
  )
}

const Header = () => {
  const isBrowser = typeof window !== 'undefined'
  return (
    <div style={{ background: 'black' }}>
      <h1
        style={{
          color: 'white',
          position: 'absolute',
          width: '100%',
          textAlign: 'center',
        }}
      >
        Hello
      </h1>
      <h1
        style={{
          color: 'white',
          position: 'absolute',
          width: '100%',
          textAlign: 'center',
          bottom: 0,
        }}
      >
        Freaks
      </h1>
      {isBrowser && (
        <Canvas
          style={{ height: '100vh', width: '100vw' }}
          camera={{ position: [0, 0, 5] }}
        >
          <ambientLight intensity={0.5} />
          <Suspense fallback={<Stars />}>
            <Frog />
          </Suspense>
          <OrbitControls
            autoRotate
            autoRotateSpeed={5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      )}
    </div>
  )
}

export default Header
