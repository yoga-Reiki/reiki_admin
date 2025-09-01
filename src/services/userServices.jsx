import axios from "axios";

export async function getAllUser({ page: page, pageSize: pageSize }) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/users?page=${page}&limit=${pageSize}`,
            // {
            //     headers: {
            //         Authorization: localStorage.getItem("token"),
            //     },
            // }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}