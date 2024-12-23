import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const uploadFile = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error while fetching the API', error.message);
  }
};
