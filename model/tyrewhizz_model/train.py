import numpy as np
import pandas as pd
import json
import joblib
from scipy.fft import fft
from sklearn.ensemble import IsolationForest

# Load dataset from JSON file
with open("tyrewhizz_dataset (2).json", "r") as file:
    data = pd.DataFrame(json.load(file))

# Compute RMS for acceleration
def compute_rms(row):
    return np.sqrt((row['Acc_X_g']**2 + row['Acc_Y_g']**2 + row['Acc_Z_g']**2) / 3)

data['RMS_Accel'] = data.apply(compute_rms, axis=1)

# Compute FFT for frequency domain analysis
def compute_fft(signal):
    fft_values = np.abs(fft(signal))
    return np.mean(fft_values)  # Mean frequency magnitude as a feature

data['FFT_Accel_X'] = compute_fft(data['Acc_X_g'])
data['FFT_Accel_Y'] = compute_fft(data['Acc_Y_g'])
data['FFT_Accel_Z'] = compute_fft(data['Acc_Z_g'])

# Define features for anomaly detection
features = ['Pressure_psi', 'Ambient_Temperature_C', 'In_Contact_Temperature_C', 'RMS_Accel', 'FFT_Accel_X', 'FFT_Accel_Y', 'FFT_Accel_Z']

# Train Isolation Forest for anomaly detection
iso_forest = IsolationForest(contamination=0.05, random_state=42)
data['Anomaly'] = iso_forest.fit_predict(data[features])

# Save trained model
joblib.dump(iso_forest, "isolation_forest_model.pkl")

# Label as 'Normal' or 'Abnormal'
data['Condition'] = data['Anomaly'].apply(lambda x: 'Abnormal' if x == -1 else 'Normal')

# Save the results
data.to_json("tyre_monitoring_results.json", orient="records", indent=4)

print("Model trained and saved successfully!")
