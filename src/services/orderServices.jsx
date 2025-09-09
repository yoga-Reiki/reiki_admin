import axios from "axios";

export async function getAllOrder({ page: page, pageSize: pageSize }) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/products/admin/orders?page=${page}&limit=${pageSize}`,
            {
                headers: {
                    Authorization: localStorage.getItem("admin_accessToken"),
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// update Order
export async function getOrderUpdate(orderId, formData) {
    try {
        const response = await axios.patch(
            `${process.env.REACT_APP_URL}/products/admin/orders/${orderId}/status`,
            formData,
            {
                headers: {
                    Authorization: localStorage.getItem("admin_accessToken"),
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

