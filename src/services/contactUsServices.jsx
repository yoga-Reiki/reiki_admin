import axios from "axios";

export async function getContactUsData() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/contact/`,
            {
                headers: {
                    Authorization: localStorage.getItem("accessToken"),
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

// contact us update api 
export async function getContactUsUpdate(formData) {
    try {
        const response = await axios.patch(
            `${process.env.REACT_APP_URL}/contact/`,
            formData,
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

