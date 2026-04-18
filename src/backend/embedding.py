from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
from typing import List
import umap
import pandas as pd
from training_data import SEED_EMBEDDINGS, SEED_WORDS

tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
model = AutoModel.from_pretrained("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
reducer = umap.UMAP(n_components=3, random_state=42, n_neighbors=5, n_jobs=1)
seed_coordinates = reducer.fit_transform(pd.DataFrame(SEED_EMBEDDINGS))

def preprocess(text:str):
    encoded_input = tokenizer(text.lower(), padding=True, truncation=True, return_tensors='pt')
    return encoded_input

def embed(text:str, raw: bool = False) -> List[float]:
    encoded_input = preprocess(text)
    with torch.no_grad():
        model_output = model(**encoded_input)
    embedding_vector = model_output.last_hidden_state.mean(dim=1)
    normalized_embedding = F.normalize(embedding_vector, p=2, dim=1).squeeze().tolist()

    if raw:
        return normalized_embedding
    else:      
        # Maybe is best to use pandas
        df = pd.DataFrame([normalized_embedding])
        embedding_3d = reducer.transform(df)

        return embedding_3d[0].tolist()

# Not available in production
def embed_batch_function(words: List[str]):
    try: 
        embeddings = [embed(word, raw=True) for word in words]
        return embeddings
    except Exception as e:
        return e
    
def get_seed_points():
    category_mapping = (
        ["Nature"] * 85 +
        ["Technology"] * 85 +
        ["Emotions"] * 80 +
        ["Geography"] * 85 +
        ["Actions"] * 85 +
        ["History"] * 80
    )

    points = [{ "word": word, "coordinates": coordinate, "embedding": embedding, "category": category } for word, coordinate, embedding, category in zip(SEED_WORDS, seed_coordinates.tolist(), SEED_EMBEDDINGS, category_mapping)]
    return points
