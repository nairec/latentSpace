import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY")
)

def store_point(text: str, embedding: list[float], coordinates: list[float], category: str):
    """Store the point and its metadata in the Supabase database"""
    data = {
        "text": text,
        "embedding": embedding,
        "coordinates": coordinates,
        "category": category
    }
    response = supabase.table("points").upsert(data, on_conflict="text").execute()
    return response

def get_all_points_db():
    """Retrieve all points from the Supabase database"""
    response = supabase.table("points").select("*").execute()
    return response.data

def store_batch(points: list[dict]):
    """Store a batch of points in the Supabase database"""
    unique_points_map = {p['text']: p for p in points}
    filtered_points = list(unique_points_map.values())

    try:
        response = supabase.table("points").upsert(
            filtered_points, 
            on_conflict="text"
        ).execute()
        return response
    except Exception as e:
        print(f"Error en el batch: {e}")
        return None

