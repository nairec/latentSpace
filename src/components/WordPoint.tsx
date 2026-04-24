import { useRef } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { usePointStore } from "../hooks/sharedState";
import type { Point } from "../hooks/sharedState";

interface WordPointProps {
    point: Point;
    index: number;
    color: string;
}

export default function WordPoint({ point, index, color }: WordPointProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const setActiveIndex = usePointStore((state) => state.setActiveIndex);
    const setTargetIndex = usePointStore((state) => state.setTargetIndex);
    const activeIndex = usePointStore((state) => state.activeIndex);
    const targetIndex = usePointStore((state) => state.targetIndex);

    const isHovered = activeIndex === index;
    const isTargeted = targetIndex === index;

    return (
        <mesh
            ref={meshRef}
            onClick={() => setTargetIndex(index)}
            position={point.coordinates}
            onPointerOver={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
                meshRef.current.scale.set(1.5, 1.5, 1.5);
            }}
            onPointerOut={() => {
                setActiveIndex(null);
                meshRef.current.scale.set(1, 1, 1);
            }}
        >
            <sphereGeometry args={[0.08, 32, 32]} />
            <meshStandardMaterial color={color} />
            
            {(isHovered || isTargeted) && (
                <Html distanceFactor={5}>
                    <div className="font-mono pointer-events-none bg-blue/80 backdrop-blur-sm text-white p-2 rounded-md shadow-xl border border-slate-200 min-w-40 w-max">
                        <p className="font-bold">{point.text}</p>
                        <p className="text-xs text-slate-500">{point.category}</p>
                        <p className="text-xs">{point.coordinates[0].toFixed(2)}X, {point.coordinates[1].toFixed(2)}Y, {point.coordinates[2].toFixed(2)}Z</p>
                    
                    </div>
                </Html>
            )}
        </mesh>
    );
};