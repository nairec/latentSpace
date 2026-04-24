import { create } from "zustand";

type Category =
    "Nature" |
    "Technology" |
    "Emotions" |
    "Geography" |
    "Actions" |
    "History" |
    "Unknown";

export interface Point {
    coordinates: [number, number, number];
    embedding: number[];
    text: string;
    category?: Category;
}

interface PointState {
    points: Point[];
    textToIndex: Record<string, number>;
    activeIndex: number | null;
    targetIndex: number | null;
    addPoint: (point: Point) => void;
    setPoints: (points: Point[]) => void;
    setActiveIndex: (activeIndex: number | null) => void;
    setTargetIndex: (targetIndex: number | null) => void;
}

const initialPoints: Point[] = [
    { coordinates: [0, 0, 0], embedding: [0.1, 0.2, 0.3], text: "example" },
    { coordinates: [1, 1, 1], embedding: [0.4, 0.5, 0.6], text: "test" },
    { coordinates: [-1, -1, -1], embedding: [0.7, 0.8, 0.9], text: "sample" },
];

export const usePointStore = create<PointState>((set) => ({
    points: [],
    textToIndex: {},
    activeIndex: null,
    targetIndex: null,
    addPoint: (point) => set((state) => {
        const newIndex = state.points.length;
        return {
            points: [...state.points, point],
            textToIndex: { ...state.textToIndex, [point.text]: newIndex },
            targetIndex: newIndex
        };
    }),
    setPoints: (newPoints) => {
        const lookup: Record<string, number> = {};
        newPoints.forEach((p, i) => { lookup[p.text] = i; });
        
        set({ 
        points: newPoints, 
        textToIndex: lookup 
        });
    },
    setActiveIndex: (activeIndex: number | null) => set({ activeIndex }),
    setTargetIndex: (targetIndex: number | null) => set({ targetIndex }),
}));

