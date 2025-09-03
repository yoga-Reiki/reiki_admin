import axios from "axios";

export async function getContactPageData() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/contact`,
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

export async function getContactUsUpdate(formData) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_URL}/contact`,
            formData,
            {
                headers: {
                    Authorization: localStorage.getItem("admin_accessToken"),
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}


