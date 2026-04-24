import { useEffect } from "react";
import "./App.css";
import SpaceRepresentation from "./components/SpaceRepresentation";
import { usePointStore } from "./hooks/sharedState";

function App() {

  const setPoints = usePointStore((state) => state.setPoints);
  const addPoint = usePointStore((state) => state.addPoint);
  const setTargetIndex = usePointStore((state) => state.setTargetIndex);

  useEffect(() => {
    const fetchInitialPoints = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/get_all_points`);
        if (!response.ok) {
          throw new Error(`Error fetching embeddings: ${response.statusText}`);
        }
        const data = await response.json();
        setPoints(data.points);
      } catch (error) {
        console.error("Failed to fetch initial points:", error);
      }
    };

    fetchInitialPoints();
  }, [setPoints]);

  const getEmbedding = async (word: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/store_word?text=${encodeURIComponent(word)}`);
      if (!response.ok) {
        throw new Error(`Error fetching embedding: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch embedding:", error);
      return null;
    }
  };

  const searchPoint = (word: string) => {
    const index = usePointStore.getState().textToIndex[word];
    if (index !== undefined) {
      setTargetIndex(index);
    } else {
      console.warn(`Text "${word}" not found in the current points.`);
    }
  }

  return (
    <>
      <div className="absolute top-0 left-0 w-full flex flex-col items-center justify-center p-10 z-10 pointer-events-none font-sans">
          <h1 className="font-sans text-4xl tracking-widest text-white pointer-events-auto mb-8">
            latentSpace
          </h1>
          <div className="flex flex-row gap-5">
            <form
              className="pointer-events-auto w-full max-w-lg"
              name="add embedding"
              onSubmit={async (event) => {
                event.preventDefault();

                const input = event.currentTarget.addWord.value.trim().toLowerCase();
                const form = event.currentTarget;
                if (!input) {
                  return;
                }

                const embedding = await getEmbedding(input);
                if (embedding) {
                  console.log("Embedding for", input, ":", embedding);
                  addPoint({
                    coordinates: embedding["coordinates"],
                    embedding: embedding["embedding"],
                    text: input,
                    category: embedding["category"] || "Unknown",
                  });
                }

                form.addWord.value = "";
              }}
            >
              <div className="relative">
                <input
                  className="w-full rounded-full border border-slate-700 bg-slate-900/90 py-3 pl-4 pr-12 text-white shadow-lg shadow-black/20 outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                  type="text"
                  name="addWord"
                  placeholder="Write a word or concept..."
                />
                <button
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-purple-600 text-white transition-colors duration-200 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  type="submit"
                  aria-label="Compute embedding"
                  title="Compute embedding"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h12" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
              </div>
            </form>
            <form 
              name="search embedding"
              className="pointer-events-auto w-full max-w-lg"
              onSubmit={(e) => {
                e.preventDefault();
                const text = e.currentTarget.searchWord.value.trim().toLowerCase();
                searchPoint(text);
                e.currentTarget.searchWord.value = "";
              }}
            >
              <div className="relative">
                <input
                  className="w-full rounded-full border border-slate-700 bg-slate-900/90 py-3 pl-4 pr-12 text-white shadow-lg shadow-black/20 outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                  type="text"
                  name="searchWord"
                  placeholder="Search for a word..."
                />
                <button
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-purple-600 text-white transition-colors duration-200 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  type="submit"
                  aria-label="Search embedding"
                  title="Search embedding"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
              
            </form>
          </div>
        </div>

      <SpaceRepresentation />
    </>
  );
}

export default App;
