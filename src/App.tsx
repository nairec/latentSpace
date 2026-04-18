import { useState } from "react";
import "./App.css";
import SpaceRepresentation from "./components/SpaceRepresentation";
import { usePointStore } from "./hooks/sharedState";

function App() {

  const [inputWord, setInputWord] = useState("");
  const points = usePointStore((state) => state.points);
  const setPoints = usePointStore((state) => state.setPoints);

  const randomizePoints = () => {
    const newPoints = points.map((point) => {
      const randomCoordinates: [number, number, number] = [
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5,
        Math.random() * 5 - 2.5,
      ];
      return { ...point, coordinates: randomCoordinates };
    });
    setPoints(newPoints);
  };

  const getEmbedding = async (word: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/embed?text=${encodeURIComponent(word)}`);
      if (!response.ok) {
        throw new Error(`Error fetching embedding: ${response.statusText}`);
      }
      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error("Failed to fetch embedding:", error);
      return null;
    }
  };

  /* Only for debug training model for PCA */
  const computeInitialEmbeddings = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/get_initial_embeddings`);
      if (!response.ok) {
        throw new Error(`Error fetching embeddings: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data); 
      return data;
    }
    catch (error) {
      console.error("Failed to fetch batch embeddings:", error);
      return null;
    }
  }

  return (
    <>
      <div className="absolute top-0 left-0 w-full flex flex-col items-center justify-center p-10 z-10 pointer-events-none">
          <h1 className="text-4xl tracking-wider text-white pointer-events-auto mb-8">
            latentSpace
          </h1>
          
          <div className="flex flex-row gap-4 pointer-events-auto">
            <input 
              className="p-2 border border-slate-700 bg-slate-900 text-white rounded active:outline-none focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors duration-200" 
              type="text" 
              value={inputWord} 
              onChange={(e) => setInputWord(e.target.value)} 
              placeholder="Write a word or concept..."
            />
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors duration-200"
              onClick={async () => {
                const embedding = await getEmbedding(inputWord);
                if (embedding) {
                  console.log("Embedding for", inputWord, ":", embedding);
                  setPoints([...points, { word: inputWord, coordinates: embedding, embedding: [], category: "Unknown" }]); // Missing embedding field
                }
                setInputWord("");
              }}
            >
              Compute Embedding
            </button>
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
              onClick={async () => {
                const response = await computeInitialEmbeddings();
                if (response) {
                  const { seed_points } = response;
                  setPoints(seed_points);
                }
              }}
            >
             Train
            </button>
          </div>
        </div>

      <SpaceRepresentation />
    </>
  );
}

export default App;
