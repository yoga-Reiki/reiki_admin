import axios from "axios";

export async function getProfileData() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/auth/profile`,
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