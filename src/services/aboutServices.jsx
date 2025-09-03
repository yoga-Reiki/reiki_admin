import axios from "axios";

export async function getAboutPageData() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/about`,
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

export async function getAboutUsUpdate(formData) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_URL}/about`,
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


