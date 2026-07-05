import axios from 'axios';

// Configure Axios with the Base URL of our backend API
const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/books`,
});

// 1. Fetch all books from the database
export const getBooks = async () => {
    try {
        const response = await API.get('/');
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error; // Throw error so the component can handle it
    }
};

// 2. Fetch a single book by ID
export const getBook = async (id) => {
    try {
        const response = await API.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book with ID ${id}:`, error);
        throw error;
    }
};

// 3. Create a new book
export const createBook = async (data) => {
    try {
        const response = await API.post('/', data);
        return response.data;
    } catch (error) {
        console.error("Error creating book:", error);
        throw error;
    }
};

// 4. Update an existing book by ID
export const updateBook = async (id, data) => {
    try {
        const response = await API.put(`/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating book with ID ${id}:`, error);
        throw error;
    }
};

// 5. Delete a book by ID
export const deleteBook = async (id) => {
    try {
        const response = await API.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting book with ID ${id}:`, error);
        throw error;
    }
};
