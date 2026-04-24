from fastapi import APIRouter
from pydantic import BaseModel
from embedding import embed_and_classify, embed_batch_function, get_seed_points
from supa import store_point, get_all_points_db, store_batch
from training_data import SEED_WORDS

api_router = APIRouter()


class TrainUmapRequest(BaseModel):
    texts: list[str]
@api_router.get("/embed")
def embed_text(text: str):
    """Embed text using the multilingual sentence transformer model"""
    return {"embedding": embed_and_classify(text, raw=True)}

@api_router.get("/store_word")
def store_word(text: str):
    """embed and store a word in the database"""
    embedding_result = embed_and_classify(text)
    store_point(text, embedding_result["embedding"], embedding_result["coordinates"], embedding_result["category"])
    return {
        "text": text,
        "embedding": embedding_result["embedding"],
        "coordinates": embedding_result["coordinates"],
        "category": embedding_result["category"]
    }

@api_router.post("/embed_batch")
def embed_batch(payload: TrainUmapRequest):
    """Embed a list of texts and store them in the database"""
    result = embed_batch_function(payload["texts"])
    if isinstance(result, Exception):
        return {"error": str(result)}
    
    store_batch([{"text": text, "embedding": embedding, "coordinates": coordinates, "category": category} for text, (embedding, coordinates, category) in zip(payload["texts"], result)])
    return {"message": "Texts embedded successfully", "embeddings": result}

@api_router.get("/get_all_points")
def get_all_points():
    """Get the list of embeddings used as a baseline for the UMAP model and store them if not already in the database"""
    points = get_all_points_db()
    if not points:
        points = get_seed_points()
        store_batch(points) # Store seed points in the database if not already present
    return {"points": points}