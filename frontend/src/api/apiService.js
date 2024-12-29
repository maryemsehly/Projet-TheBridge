import axios from 'axios';

// Set up the base URL for your API
const API_URL = 'http://localhost:5000/api/items';

// Function to get all items
export const getItems = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });
    return response.data; // Return the list of items
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Function to create a new item
export const createItem = async (itemData, token) => {
  try {
    const response = await axios.post(API_URL, itemData, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });
    return response.data; // Return the created item
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

// Function to update an item by ID
export const updateItem = async (id, itemData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, itemData, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });
    return response.data; // Return the updated item
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

// Function to delete an item by ID
export const deleteItem = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token for authentication
      },
    });
    return id; // Return the ID of the deleted item
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
