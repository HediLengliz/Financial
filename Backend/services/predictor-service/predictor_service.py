from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import joblib
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import uvicorn
import os

# CONFIG
MODEL_DIR = 'model'
MAX_SEQ_LEN = 100

# Load model, tokenizer, and scaler
try:
    model = tf.keras.models.load_model(os.path.join(MODEL_DIR, 'project_predictor.keras'))
    tokenizer = joblib.load(os.path.join(MODEL_DIR, 'tokenizer.pkl'))
    scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
except Exception as e:
    raise Exception(f"Failed to load model or assets: {str(e)}")

# FastAPI app
app = FastAPI(title="Construction Project Predictor API")

# Request model
class ProjectDescription(BaseModel):
    description: str

# Prediction endpoint
@app.post("/predict")
async def predict(project: ProjectDescription):
    try:
        # Preprocess input
        description = project.description
        seq = tokenizer.texts_to_sequences([description])
        padded = pad_sequences(seq, maxlen=MAX_SEQ_LEN, padding='post')

        # Predict
        predicted_scaled = model.predict(padded)
        predicted = scaler.inverse_transform(predicted_scaled)

        # Format response
        result = {
            "estimated_cost_usd": round(float(predicted[0][0]), 2),
            "duration_days": round(float(predicted[0][1]), 2),
            "workers_needed": int(predicted[0][2]),
            "engineers": int(predicted[0][3]),
            "steel_tons": round(float(predicted[0][4]), 2)
        }
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# Run the app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)