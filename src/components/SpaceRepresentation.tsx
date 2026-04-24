import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import {  Grid, Stars } from '@react-three/drei'
import { usePointStore } from "../hooks/sharedState";
import WordPoint from "./WordPoint";
import CameraController from "./CameraController";

const categoryColorMap: Record<string, string> = {
    "Nature": "#22c55e",        
    "Technology": "#06b6d4",    
    "Emotions": "#ec4899",      
    "Geography": "#f59e0b",    
    "Actions": "#8b5cf6",       
    "History": "#ef4444",
    "Sports":  "#efc144"      
};

export default function spaceRepresentation() {

    const points = usePointStore((state) => state.points);

    const getColorForCategory = (category?: string): string => {
        if (!category || !categoryColorMap[category]) {
            return "#6b7280"; // default gray
        }
        return categoryColorMap[category];
    };

    return (
        <div className="fixed inset-0 z-0">
            <Canvas>
                <fog attach="fog" args={['#050505', 10, 50]} />
            
                <shaderMaterial attach="background"/>
                <ambientLight intensity={.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <CameraController />
                {points.map((point, index) => (
                    <WordPoint key={index} point={point} index={index} color={getColorForCategory(point.category)} />
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
                <axesHelper args={[5]} />
            </Canvas>
        </div>
    )
}