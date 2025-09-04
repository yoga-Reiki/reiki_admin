import axios from "axios";

export async function getAllOrder({ page: page, pageSize: pageSize }) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/order?page=${page}&limit=${pageSize}`,
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