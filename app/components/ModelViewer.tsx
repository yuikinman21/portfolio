'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Center } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';

// 瞳のデータ構造
type PupilData = {
  mesh: THREE.Mesh;
  baseQuaternion: THREE.Quaternion; // 角度(Euler)ではなく、姿勢(Quaternion)で保存
};

function SceneContent() {
  const { scene } = useGLTF('/EXPO2025_eye.glb');
  
  // 瞳のデータを管理する配列Ref
  const pupilsRef = useRef<PupilData[]>([]);

  useEffect(() => {
    pupilsRef.current = [];

    scene.traverse((child) => {
      // 名前に "Hitomi_Blue" を含むメッシュを探す
      if ((child as THREE.Mesh).isMesh && child.name.includes('Hitomi_Blue')) {
        const mesh = child as THREE.Mesh;
        
        // ★重要：初期の「姿勢（クォータニオン）」を保存しておく
        const initialQuaternion = mesh.quaternion.clone();

        pupilsRef.current.push({
          mesh: mesh,
          baseQuaternion: initialQuaternion
        });
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (pupilsRef.current.length === 0) return;

    const mouseX = state.mouse.x; // -1 (左) ~ 1 (右)
    const mouseY = state.mouse.y; // -1 (下) ~ 1 (上)
    
    // 動きの大きさ（お好みで調整してください）
    const intensity = 0.2;

    // ■カメラの向きに合わせて回転軸を作る
    // これにより、モデルが横を向いていても、カメラから見て「上下左右」に正しく動きます
    const camera = state.camera;
    
    // カメラの「右方向」と「上方向」のベクトルを取得
    const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

    // ■マウスの動きに応じた回転を作る
    // 縦の動き(Y) -> カメラの右軸(camRight)を中心に回転
    const rotationX = new THREE.Quaternion().setFromAxisAngle(camRight, mouseY * intensity);
    // 横の動き(X) -> カメラの上軸(camUp)を中心に回転
    const rotationY = new THREE.Quaternion().setFromAxisAngle(camUp, mouseX * intensity);

    // 回転を合成する (横回転 × 縦回転)
    const targetRotation = rotationY.multiply(rotationX);

    pupilsRef.current.forEach(({ mesh, baseQuaternion }) => {
      // ★重要： 「マウス回転」 × 「初期姿勢」 の順番で適用
      // これで「元の向きを保ったまま、カメラから見た方向にグリッと動く」ようになります
      const finalQuaternion = targetRotation.clone().multiply(baseQuaternion);

      // 滑らかに動かす (Slerp)
      mesh.quaternion.slerp(finalQuaternion, 0.1);
    });
  });

  // モデルのサイズ調整（scaleはお好みで）
  return <primitive object={scene} scale={1.5} />;
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