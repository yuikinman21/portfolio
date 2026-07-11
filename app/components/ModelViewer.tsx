'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Center } from '@react-three/drei';
import { Suspense, useEffect, useRef, useMemo } from 'react';
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

  // Canvasの実DOM要素（gl.domElement）を取得
  const gl = useThree((s) => s.gl);

  // マウス座標(-1〜1)を保持。R3Fの state.pointer はマウント時に取得した
  // 親要素の矩形(size.left/top)に依存しており、カードが後からレイアウト移動すると
  // 値がズレて稼働中心が左に寄る。そのため Canvas の「現在の」矩形から毎回計算する。
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      // Canvas外も追従するが、稼働範囲は[-1,1]にクランプ
      mouseRef.current.x = THREE.MathUtils.clamp(x, -1, 1);
      mouseRef.current.y = THREE.MathUtils.clamp(y, -1, 1);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [gl]);

  useEffect(() => {
    pupilsRef.current = [];

    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name.includes('Hitomi_Blue')) {
        const mesh = child as THREE.Mesh;

        // 初回の「本当の初期位置」を userData に保存
        if (!mesh.userData.initialQuaternion) {
          mesh.userData.initialQuaternion = mesh.quaternion.clone();
        }

        // 休止位置はモデル本来の瞳の向き（白目の中央）そのもの。
        // 余計なオフセットを加えないことで、マウス無操作時は常に中央を向く。
        const initialQuaternion = mesh.userData.initialQuaternion.clone();

        pupilsRef.current.push({
          mesh: mesh,
          baseQuaternion: initialQuaternion
        });
      }
    });
  }, [clone]);

  useFrame((state) => {
    if (pupilsRef.current.length === 0) return;

    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;

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