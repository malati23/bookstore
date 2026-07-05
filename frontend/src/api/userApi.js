import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/users`,
});

export const getUsers = async () => {
    try {
        const response = await API.get('/');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const updateUserRole = async (id, role) => {
    try {
        const response = await API.put(`/${id}/role`, { role });
        return response.data;
    } catch (error) {
        console.error(`Error updating user role ${id}:`, error);
        throw error;
    }
};

export const updateUserStatus = async (id, status) => {
    try {
        const response = await API.put(`/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating user status ${id}:`, error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await API.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        throw error;
    }
};
