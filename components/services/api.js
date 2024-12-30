import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const getSensorStatus = async () => {
    const response = await axios.get(`${API_BASE}/sensor/status`);
    return response.data;
};

export const getSensorData = async () => {
    const response = await axios.get(`${API_BASE}/sensor/data`);
    return response.data;
};

export const updateSensorStatus = async (isConnected) => {
    const response = await axios.post(`${API_BASE}/sensor/status`, { isConnected });
    return response.data;
};

export const addSensorData = async (readings) => {
    const response = await axios.post(`${API_BASE}/sensor/data`, { readings });
    return response.data;
};
