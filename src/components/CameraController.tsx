import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePointStore } from '../hooks/sharedState';

export default function CameraController() {
  const targetIndex = usePointStore(state => state.targetIndex);
  const points = usePointStore(state => state.points);
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const isAutoPanning = useRef(true);

  const handleStart = () => {
    isAutoPanning.current = false;
  };

  useEffect(() => {
    if (targetIndex !== null) {
      isAutoPanning.current = true;
    }
  }, [targetIndex]);

  useFrame((state, delta) => {
    if (targetIndex !== null && isAutoPanning.current && points[targetIndex]) {
      const targetPoint = points[targetIndex].coordinates;
      const targetVector = new THREE.Vector3(...targetPoint);

      const desiredPosition = new THREE.Vector3(
        targetVector.x, 
        targetVector.y, 
        targetVector.z + 2 
      );

      camera.position.lerp(desiredPosition, 0.1);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetVector, 0.1);
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(desiredPosition) < 0.1) {
        isAutoPanning.current = true;
      }
    }
  });

  return <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} onStart={handleStart} />;
}