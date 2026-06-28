import axios from 'axios';
import { API_URL } from '../utils/constants';

/**
 * Dedicated layer for Axios configuration and HTTP requests
 */
export const getUsers = () => {
  return axios.get(API_URL);
};

export const createUser = (userData) => {
  return axios.post(API_URL, userData);
};

export const updateUser = (id, userData) => {
  return axios.put(`${API_URL}/${id}`, userData);
};

export const deleteUser = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
