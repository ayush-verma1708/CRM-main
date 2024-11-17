// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your backend API URL

// Generalized function to fetch data from a given endpoint
const fetchData = async (endpoint, page, limit, search = '', magazine = '') => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      params: { page, limit, search, magazine }, // Include magazine as a parameter
    });
    console.log(page, limit, endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Fetch records from the API
export const fetchRecords = async (page, limit, search = '') => {
  return fetchData('/records', page, limit, search);
};

// Fetch users from the API
export const fetchUsers = async (page, limit, search = '') => {
  return fetchData('/api/users', page, limit, search);
};

export const fetchRecordById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/records/${id}`);

    // Check if response is not OK (status code outside of 2xx range)
    if (!response.ok) {
      const errorText = await response.text(); // Read the response text for debugging
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json(); // Parse JSON data
    return data;
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    throw error; // Rethrow the error for handling in the calling function
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
export const updateCustomer = async (updatedData) => {
  try {
    const id = window.localStorage.getItem('currCustId');

    console.log('Attempting to update customer with ID:', id);
    console.log('Payload data:', updatedData);

    const queryParams = new URLSearchParams();

    Object.entries(updatedData).map(([key, value]) => {
      queryParams.append(key, value);
    });

    queryParams.append('id', id);

    const response = await axios.patch(
      `${API_URL}/records/${id}?${queryParams}`,
      updatedData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error updating customer:', error.response.data); // Server response error
    } else {
      console.error('Error updating customer:', error.message); // Network or other error
    }
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
// Update Notes for a specific record by ID
export const updateRecordNotes = async (id, note, noteDate) => {
  try {
    const response = await axios.patch(`${API_URL}/records/${id}/notes`, {
      note: note,
      noteDate: noteDate, // Include the noteDate in the request body
    });
    console.log(id);
    return response.data;
  } catch (error) {
    console.error('Error updating notes:', error);
    throw error;
  }
};
