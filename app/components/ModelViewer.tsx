'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Center } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

// 瞳のデータ構造を定義（メッシュ本体と、その初期角度）
type PupilData = {
  mesh: THREE.Mesh;
  baseRotation: THREE.Euler; // 初期角度を保存する場所
};

function SceneContent() {
  const { scene } = useGLTF('/EXPO2025_eye.glb');
  
  // 瞳のデータを管理する配列Ref
  const pupilsRef = useRef<PupilData[]>([]);

  useEffect(() => {
    pupilsRef.current = [];

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name.includes('Hitomi_Blue')) {
        const mesh = child as THREE.Mesh;

        // ⚠️重要：現在の回転角度（初期位置）をクローンして保存しておく
        const initialRotation = mesh.rotation.clone();

        pupilsRef.current.push({
          mesh: mesh,
          baseRotation: initialRotation
        });

        console.log(`✅ 瞳を登録 (初期角度保存済み): ${mesh.name}`);
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (pupilsRef.current.length === 0) return;

    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;
    const intensity = 0.2; // 少し強めにしてもOK

    // 登録された全ての瞳をループ
    pupilsRef.current.forEach(({ mesh, baseRotation }) => {
      // マウスによる「追加の」回転量
      const offsetX = -mouseY * intensity;
      const offsetY = mouseX * intensity;

      // 【修正ポイント】
      // 「初期角度(baseRotation)」 に 「マウスの動き」 を足した場所を目指す
      const targetRotationX = baseRotation.x + offsetX;
      const targetRotationY = baseRotation.y + offsetY;
      // Z軸（首をかしげる動き）は初期角度のままにする
      const targetRotationZ = baseRotation.z;

      // 滑らかに移動 (Lerp)
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotationX, 0.1);
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRotationY, 0.1);
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetRotationZ, 0.1);
    });
  });

  return <primitive object={scene} scale={1.5}/>;
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