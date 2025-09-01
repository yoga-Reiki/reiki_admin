import axios from "axios";

export async function userLogin({ body: body }) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_URL}/auth/login`,
            body
        )
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function userLogout() {
    try {
        const token = localStorage.getItem("admin_accessToken");

        const response = await axios.post(
            `${process.env.REACT_APP_URL}/auth/logout`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        throw error;
    }
}

