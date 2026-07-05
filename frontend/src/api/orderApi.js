import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/orders`,
});

// Fetch all orders
export const getOrders = async () => {
    try {
        const response = await API.get('/');
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

// Fetch order by id
export const getOrder = async (id) => {
    try {
        const response = await API.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order ${id}:`, error);
        throw error;
    }
};

// Update order status
export const updateOrderStatus = async (id, orderStatus) => {
    try {
        const response = await API.put(`/${id}`, { orderStatus });
        return response.data;
    } catch (error) {
        console.error(`Error updating order ${id}:`, error);
        throw error;
    }
};
