from fastapi import APIRouter
from pydantic import BaseModel
from embedding import embed, embed_batch_function, get_seed_points
from training_data import SEED_WORDS

api_router = APIRouter()


class TrainUmapRequest(BaseModel):
    words: list[str]

@api_router.get("/embed")
def embed_text(text: str):
    """Embed text using the multilingual sentence transformer model"""
    return {"embedding": embed(text)}

@api_router.post("/store_word")
def store_word(word: str):
    """Store an embedded word (placeholder for future implementation)"""
    embedded_word = embed(word)
    return {
        "word": word,
        "embedding": embedded_word,
        "dimension": len(embedded_word)
    }

@api_router.post("/embed_batch")
def embed_batch(payload: TrainUmapRequest):
    """Embed a list of words"""
    result = embed_batch_function(SEED_WORDS) # CAMBIAR DESPUÉS DE ENTRENAR
    if isinstance(result, Exception):
        return {"error": str(result)}
    return {"message": "Words embedded successfully", "embeddings": result}

@api_router.get("/get_initial_embeddings")
def get_initial_embeddings():
    """Get the list of embeddings used as a baseline for the UMAP model"""
    seed_points = get_seed_points()
    return {"seed_points": seed_points}