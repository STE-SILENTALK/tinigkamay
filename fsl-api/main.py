from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import csv
import os
import pickle
import numpy as np
import pandas as pd

# Machine Learning Imports (Scikit-Learn for Static, TensorFlow/Keras for Dynamic)
from sklearn.ensemble import RandomForestClassifier
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout

# ============================================================================
# PYTHON BACKEND SERVER & AI ENGINE (main.py)
# This file runs your local API server (http://127.0.0.1:8000).
# It receives hand coordinates from the React website, trains the AI models,
# and sends back the predicted letter or phrase.
# ============================================================================

# 👉 EDIT HERE: API Title & Description (Shown on http://localhost:8000/docs)
app = FastAPI(
    title="FSL Translator API",
    description="Backend API for the FSL Translator capstone project (Static & Dynamic)."
)

# Allows the React frontend (localhost:5173) to talk to this Python backend without security blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# SAVED AI MODEL & DATASET FILENAMES
# 👉 EDIT HERE: Only change these if you want to rename where your trained AI
# brains and recorded datasets are saved inside the `fsl-api` folder.
# TIP: If you want to completely erase all trained signs and start over from zero,
# simply delete these 5 files from your folder!
# ============================================================================
STATIC_MODEL_PATH = "fsl_model.pkl"              # Trained Random Forest AI (Letters)
STATIC_CSV_PATH = "fsl_dataset.csv"              # Recorded Static hand coordinates

DYNAMIC_MODEL_PATH = "fsl_dynamic_model.keras"   # Trained LSTM Neural Network (Phrases)
DYNAMIC_DATASET_PATH = "fsl_dynamic_dataset.pkl" # Recorded 30-frame motion sequences
DYNAMIC_LABELS_PATH = "fsl_labels.pkl"           # List of phrase names (ID -> Word map)

static_model = None
dynamic_model = None
dynamic_labels_map = {}

# ============================================================================
# STARTUP LOADERS (Loads your trained AI brains into memory when server starts)
# ============================================================================
def load_static_model():
    global static_model
    if os.path.exists(STATIC_MODEL_PATH):
        with open(STATIC_MODEL_PATH, "rb") as f:
            static_model = pickle.load(f)
        print("Static Model loaded successfully.")

def load_dynamic_models():
    global dynamic_model, dynamic_labels_map
    if os.path.exists(DYNAMIC_MODEL_PATH):
        dynamic_model = load_model(DYNAMIC_MODEL_PATH)
        print("Dynamic LSTM Model loaded successfully.")
    if os.path.exists(DYNAMIC_LABELS_PATH):
        with open(DYNAMIC_LABELS_PATH, "rb") as f:
            dynamic_labels_map = pickle.load(f)
        print("Dynamic Labels mapped.")

load_static_model()
load_dynamic_models()


# ============================================================================
# DATA VALIDATION SCHEMAS (Pydantic)
# DO NOT CHANGE: Ensures the React frontend sends exactly 126 hand numbers.
# ============================================================================

# Static (1-Frame Snapshot) Schemas
class StaticSample(BaseModel):
    label: str
    coordinates: List[float]  # 126 numbers (63 Left Hand + 63 Right Hand)

class StaticTrainingPayload(BaseModel):
    dataset: List[StaticSample]

class StaticPredictionPayload(BaseModel):
    coordinates: List[float]  # 126 numbers

# Dynamic (30-Frame Moving Sequence) Schemas
class DynamicSample(BaseModel):
    label: str
    sequence: List[List[float]] # 30 frames, each containing 126 numbers

class DynamicTrainingPayload(BaseModel):
    dataset: List[DynamicSample]

class DynamicPredictionPayload(BaseModel):
    sequence: List[List[float]] 


# ============================================================================
# 1. STATIC ENDPOINTS (Random Forest AI for Stationary Letters)
# ============================================================================

@app.post("/api/train")
def train_static(payload: StaticTrainingPayload):
    """Saves recorded static hand snapshots to CSV and trains the Random Forest AI."""
    global static_model
    if not payload.dataset:
        raise HTTPException(status_code=400, detail="Dataset is empty.")

    file_exists = os.path.isfile(STATIC_CSV_PATH)
    
    # Step 1: Add the newly recorded hand coordinates to `fsl_dataset.csv`
    with open(STATIC_CSV_PATH, mode='a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            header = ['label'] + [f'coord_{i}' for i in range(126)]
            writer.writerow(header)
        
        for sample in payload.dataset:
            row = [sample.label] + sample.coordinates
            writer.writerow(row)

    # Step 2: Load the entire CSV spreadsheet to train the AI
    df = pd.read_csv(STATIC_CSV_PATH)
    X = df.iloc[:, 1:].values
    y = df.iloc[:, 0].values

    # ------------------------------------------------------------------------
    # 👉 EDIT HERE: Static AI Training Settings (Random Forest)
    # - n_estimators=100 means it builds 100 decision trees.
    #   Increase to 200 for slightly higher accuracy if you have lots of letters.
    # ------------------------------------------------------------------------
    static_model = RandomForestClassifier(n_estimators=100, random_state=42)
    static_model.fit(X, y)

    # Step 4: Save the trained AI brain into `fsl_model.pkl`
    with open(STATIC_MODEL_PATH, "wb") as f:
        pickle.dump(static_model, f)

    return {"message": "Static model trained successfully!", "total_samples": len(df)}


@app.post("/api/predict-static")
def predict_static(payload: StaticPredictionPayload):
    """Receives 126 coordinates from the camera and returns the predicted letter."""
    global static_model
    if static_model is None:
        raise HTTPException(status_code=500, detail="Static model not trained yet.")
    
    if len(payload.coordinates) != 126:
        raise HTTPException(status_code=400, detail=f"Expected 126 coordinates, got {len(payload.coordinates)}")

    try:
        prediction = static_model.predict([payload.coordinates])
        return {"prediction": str(prediction[0])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# 2. DYNAMIC ENDPOINTS (LSTM Neural Network for Moving Phrases)
# ============================================================================

@app.post("/api/train-dynamic")
def train_dynamic(payload: DynamicTrainingPayload):
    """Saves 30-frame motion sequences and trains the LSTM Deep Learning model."""
    global dynamic_model, dynamic_labels_map
    if not payload.dataset:
        raise HTTPException(status_code=400, detail="Dataset is empty.")

    try:
        # Step 1: Load existing recorded sequences so we don't erase older phrases
        master_dataset = []
        if os.path.exists(DYNAMIC_DATASET_PATH):
            with open(DYNAMIC_DATASET_PATH, "rb") as f:
                master_dataset = pickle.load(f)

        # Step 2: Add the newly recorded sequences to the list
        for sample in payload.dataset:
            master_dataset.append({
                "label": sample.label,
                "sequence": sample.sequence
            })

        # Step 3: Save the updated dataset back to `fsl_dynamic_dataset.pkl`
        with open(DYNAMIC_DATASET_PATH, "wb") as f:
            pickle.dump(master_dataset, f)

        # Step 4: Prepare the data for TensorFlow/Keras
        X = []
        y_raw = []
        for data in master_dataset:
            X.append(data["sequence"])
            y_raw.append(data["label"])

        X = np.array(X)
        
        # NOTE: You need at least 2 DIFFERENT phrases recorded for softmax classification to train properly
        unique_labels = sorted(list(set(y_raw)))
        label_to_id = {label: i for i, label in enumerate(unique_labels)}
        y = np.array([label_to_id[label] for label in y_raw])
        
        # Save the dictionary of phrase names (`fsl_labels.pkl`)
        with open(DYNAMIC_LABELS_PATH, "wb") as f:
            pickle.dump(label_to_id, f)

        # --------------------------------------------------------------------
        # 👉 EDIT HERE: LSTM Neural Network Brain Architecture & Training Speed
        # - epochs=30: How many times the AI studies the dataset during training.
        #   Increase to 50 if the AI isn't learning your phrases well; lower to 20 to train faster.
        # - batch_size=8: How many sequences it studies at once.
        # --------------------------------------------------------------------
        model = Sequential([
            LSTM(64, return_sequences=True, input_shape=(X.shape[1], X.shape[2])),
            Dropout(0.2),
            LSTM(32),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(len(unique_labels), activation='softmax')
        ])

        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        model.fit(X, y, epochs=30, batch_size=8, verbose=1)
        
        # Step 6: Save the trained LSTM model (`fsl_dynamic_model.keras`) and reload it live
        model.save(DYNAMIC_MODEL_PATH)
        load_dynamic_models()

        return {
            "message": "Dynamic Model trained successfully!", 
            "classes": unique_labels,
            "total_samples": len(master_dataset)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/predict-dynamic")
def predict_dynamic(payload: DynamicPredictionPayload):
    """Receives 30 frames of hand movement and returns the predicted phrase + confidence %."""
    global dynamic_model, dynamic_labels_map
    if dynamic_model is None or not dynamic_labels_map:
        raise HTTPException(status_code=500, detail="Dynamic model not trained yet.")

    try:
        # verbose=0 keeps the terminal clean so it doesn't spam logs every second
        input_data = np.array([payload.sequence]) 
        prediction = dynamic_model.predict(input_data, verbose=0)
        
        predicted_class_id = np.argmax(prediction[0])
        confidence = float(np.max(prediction[0]))

        # Convert the predicted ID number back into the actual phrase text (e.g., "MAHAL KITA")
        id_to_label = {i: label for label, i in dynamic_labels_map.items()}

        return {
            "prediction": id_to_label.get(predicted_class_id, "Unknown"),
            "confidence": round(confidence * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))