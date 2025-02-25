import requests

url = "http://127.0.0.1:8000/predict"
data = {
    "pressure": 30.5,
    "ambient_temp": 27.8,
    "object_temp": 60.2,
    "acc_x": 0.03,
    "acc_y": 0.04,
    "acc_z": 0.02
}

response = requests.post(url, json=data)
print(response.json())  # Expected: {"tyre_condition": "Normal" or "Abnormal"}
