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
    const activeIndex = usePointStore((state) => state.activeIndex);

    const isHovered = activeIndex === index;

    return (
        <mesh
            ref={meshRef}
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
            <sphereGeometry args={[0.1, 32, 32]} />
            <meshStandardMaterial color={color} />
            
            {isHovered && (
                <Html distanceFactor={10}>
                    <div className="pointer-events-none bg-blue/80 backdrop-blur-sm text-white p-2 rounded-md shadow-xl border border-slate-200 min-w-max">
                        <p className="font-bold">{point.word}</p>
                        <p className="text-xs text-slate-500">{point.category}</p>
                    </div>
                </Html>
            )}
        </mesh>
    );
};