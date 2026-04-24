from transformers import pipeline

POSSIBLE_CATEGORIES = ["Nature","Technology","Emotions","Geography","Actions","History","Sports","Food","Animals","Art","Science","Music","Literature","Health","Politics","Education","Travel","Business","Finance","Entertainment"]
classifier = pipeline("zero-shot-classification", model="MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7")

def classify(text: str):

    res = classifier(text, candidate_labels=POSSIBLE_CATEGORIES)
    return res["labels"][0]