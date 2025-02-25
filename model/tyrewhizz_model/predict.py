import numpy as np
import joblib
from scipy.fft import fft

# Load trained model
model = joblib.load("isolation_forest_model.pkl")

# Function to check tyre status based on user input
def check_tyre_status():
    # Take user input
    pressure = float(input("Enter Pressure (psi): "))
    ambient_temp = float(input("Enter Ambient Temperature (C): "))
    object_temp = float(input("Enter In-Contact Temperature (C): "))
    acc_x = float(input("Enter Acceleration X (g): "))
    acc_y = float(input("Enter Acceleration Y (g): "))
    acc_z = float(input("Enter Acceleration Z (g): "))

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
    
    print(f"Tyre Condition: {status}")

# Run user input check
if __name__ == "__main__":
    check_tyre_status()
