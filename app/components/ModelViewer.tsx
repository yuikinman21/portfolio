'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Center } from '@react-three/drei';
import { Suspense } from 'react';

// モデル表示用コンポーネント
// publicフォルダに 'model.glb' があればそれを読み込み、なければドーナツ型を表示
function SceneContent() {


  const { scene } = useGLTF('/EXPO2025.glb');
  return <primitive object={scene} />;

  return (
    <mesh rotation={[0.5, 0.5, 0]}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.8} />
    </mesh>
  );
}

export default function ModelViewer() {
  return (
    <div className="w-full h-full min-h-[200px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Center>
              <SceneContent />
            </Center>
          </Float>
          
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />
        </Suspense>
      </Canvas>
    </div>
  );
}