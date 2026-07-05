import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/reviews`,
});

export const getReviews = async () => {
    try {
        const response = await API.get('/');
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

export const updateReviewStatus = async (id, status) => {
    try {
        const response = await API.put(`/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Error updating review status ${id}:`, error);
        throw error;
    }
};

export const deleteReview = async (id) => {
    try {
        const response = await API.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting review ${id}:`, error);
        throw error;
    }
};
