// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your backend API URL

export const fetchRecords = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await axios.get(`${API_URL}/records`, {
      params: { page, limit, search },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching records:', error);
    throw error;
  }
};

// Create customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_URL}/records`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Update customer
export const updateCustomer = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/records/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (id) => {
  try {
    await axios.delete(`${API_URL}/records/${id}`);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};
