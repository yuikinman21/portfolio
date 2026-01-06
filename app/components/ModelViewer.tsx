'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Center } from '@react-three/drei';
import { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

type PupilData = {
  mesh: THREE.Mesh;
  baseQuaternion: THREE.Quaternion;
};

function SceneContent() {
  const { scene } = useGLTF('/EXPO2025_eye.glb');
  
  // useMemoでクローンを作成
  const clone = useMemo(() => scene.clone(), [scene]);
  
  const pupilsRef = useRef<PupilData[]>([]);

  // ★画面サイズ判定用のState
  const [isMobile, setIsMobile] = useState(false);

  // ★画面サイズを監視するEffect
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    // 初期値をセット
    setIsMobile(mediaQuery.matches);

    // リスナー定義
    const handleResize = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // イベントリスナー登録
    mediaQuery.addEventListener('change', handleResize);

    // クリーンアップ
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  useEffect(() => {
    pupilsRef.current = [];

    // ★ここで画面サイズに応じて補正値を切り替える
    // isMobile(768px未満)なら 0.0、それ以外(PC等)なら 0.3
    const shiftX = isMobile ? 0.0 : 0.4; 
    const shiftY = isMobile ? 0.1 : 0.0; 

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name.includes('Hitomi_Blue')) {
        const mesh = child as THREE.Mesh;

        // 初回の「本当の初期位置」を userData に保存
        if (!mesh.userData.initialQuaternion) {
          mesh.userData.initialQuaternion = mesh.quaternion.clone();
        }
        
        // 現在の mesh.quaternion ではなく、保存しておいた初期値を使う
        const initialQuaternion = mesh.userData.initialQuaternion.clone();

        const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), shiftX);
        const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), shiftY);
        const offsetRotation = qy.multiply(qx);
        
        const centeredQuaternion = initialQuaternion.premultiply(offsetRotation);

        pupilsRef.current.push({
          mesh: mesh,
          baseQuaternion: centeredQuaternion
        });
      }
    });
    // ★依存配列に isMobile を追加し、画面サイズが変わるたびに再計算させる
  }, [clone, isMobile]);

  useFrame((state) => {
    if (pupilsRef.current.length === 0) return;

    const mouseX = state.pointer.x; 
    const mouseY = state.pointer.y; 
    
    const intensity = 0.2;
    const camera = state.camera;

    const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

    const rotationX = new THREE.Quaternion().setFromAxisAngle(camRight, -mouseY * intensity);
    const rotationY = new THREE.Quaternion().setFromAxisAngle(camUp, mouseX * intensity);

    const targetRotation = rotationY.multiply(rotationX);

    pupilsRef.current.forEach(({ mesh, baseQuaternion }) => {
      const finalQuaternion = targetRotation.clone().multiply(baseQuaternion);
      mesh.quaternion.slerp(finalQuaternion, 0.1);
    });
  });

  return <primitive object={clone} scale={1.5} />;
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