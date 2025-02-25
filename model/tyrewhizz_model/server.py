from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from scipy.fft import fft
from fastapi.middleware.cors import CORSMiddleware  # Import CORS Middleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Define Pydantic model for request body validation
class SensorData(BaseModel):
    pressure: float
    ambient_temp: float
    object_temp: float
    acc_x: float
    acc_y: float
    acc_z: float

# Load trained model
model = joblib.load("isolation_forest_model.pkl")

@app.post("/predict")
async def predict(data: SensorData):  # Use Pydantic model for validation
    # Extract sensor data
    pressure = data.pressure
    ambient_temp = data.ambient_temp
    object_temp = data.object_temp
    acc_x = data.acc_x
    acc_y = data.acc_y
    acc_z = data.acc_z

@app.get("/")
async def root():
    return {"message": "Welcome to the TyreWhizz Prediction API!"}


    # Compute derived features
    rms_accel = np.sqrt((acc_x**2 + acc_y**2 + acc_z**2) / 3)
    fft_acc_x = np.abs(fft([acc_x]))[0]
    fft_acc_y = np.abs(fft([acc_y]))[0]
    fft_acc_z = np.abs(fft([acc_z]))[0]

    # Create input array
    input_features = np.array([[pressure, ambient_temp, object_temp, rms_accel, fft_acc_x, fft_acc_y, fft_acc_z]])

    # Predict condition
    prediction = model.predict(input_features)
    status = "Abnormal" if prediction[0] == -1 else "Normal"

    return {"tyre_condition": status}
