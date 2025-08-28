import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products'; // update to your backend

export const getProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addProduct = async (payload) => {
  const res = await axios.post(`${API_URL}/add`, payload); // <- add /add here
  return res.data;
};

export const updateProduct = async (id, payload) => {
  const res = await axios.put(`${API_URL}/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
