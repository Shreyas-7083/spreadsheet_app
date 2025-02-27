import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

// Fetch all spreadsheets (if needed)
export const fetchSpreadsheets = async () => {
  const response = await axios.get(`${API_BASE_URL}spreadsheets/`);
  return response.data;
};

// Fetch all cells
export const fetchCells = async () => {
  const response = await axios.get(`${API_BASE_URL}cells/`);
  return response.data;
};

// Update a specific cell by ID
export const updateCell = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}cells/${id}/`, data);
  return response.data;
};

// Save a new spreadsheet and get its ID
export const saveSpreadsheet = async () => {
  const response = await axios.post(`${API_BASE_URL}save/`);
  return response.data;
};

// Load a specific spreadsheet by its ID
export const loadSpreadsheet = async (spreadsheetId) => {
  const response = await axios.get(`${API_BASE_URL}load/${spreadsheetId}/`);
  return response.data;
};
