import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from '@react-three/drei'
import { useRef } from "react";
import { createRoot } from "react-dom/client";
import { usePointStore } from "../hooks/sharedState";

export default function spaceRepresentation() {

    const points = usePointStore((state) => state.points);

    return (
        <div className="fixed inset-0 z-0">
            <Canvas>
                <ambientLight color="blue" intensity={2} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                {points.map((point, index) => (
                    <mesh key={index} position={point.coordinates}>
                        <sphereGeometry args={[0.1, 32, 32]} />
                        <meshStandardMaterial color="cyan" />
                    </mesh>
                ))}
                <Grid 
                    infiniteGrid 
                    cellSize={0.1} 
                    sectionSize={1} 
                    fadeDistance={30} 
                    fadeStrength={5}
                    sectionColor="#4a5568"
                    cellColor="#2d3748"
                />
                <axesHelper args={[1]} />
            </Canvas>
        </div>
    )
}