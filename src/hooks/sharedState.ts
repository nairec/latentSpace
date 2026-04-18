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
    word: string;
    category?: Category;
}

interface PointState {
    points: Point[];
    activeIndex: number | null;
    addPoint: (point: Point) => void;
    setPoints: (points: Point[]) => void;
    setActiveIndex: (activeIndex: number | null) => void;
}

const initialPoints: Point[] = [
    { coordinates: [0, 0, 0], embedding: [0.1, 0.2, 0.3], word: "example" },
    { coordinates: [1, 1, 1], embedding: [0.4, 0.5, 0.6], word: "test" },
    { coordinates: [-1, -1, -1], embedding: [0.7, 0.8, 0.9], word: "sample" },
];

export const usePointStore = create<PointState>((set) => ({
    points: [],
    activeIndex: null,
    addPoint: (point: Point) => set((state) => ({ points: [...state.points, point] })),
    setPoints: (points: Point[]) => set({ points }),
    setActiveIndex: (activeIndex: number | null) => set({ activeIndex }),
}));

