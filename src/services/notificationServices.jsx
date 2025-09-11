import axios from "axios";

export async function getNotification({ limit: limit, skip: skip }) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/notifications?limit=${limit}&skip=${skip}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("admin_accessToken")}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}
