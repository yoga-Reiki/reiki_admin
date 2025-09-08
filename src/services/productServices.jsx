import axios from "axios";

export async function getProductData() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/product`,
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

// add product 
export async function getAddProduct(formData) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_URL}/product`,
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

// update product
export async function getProductUpdate(formData, productId) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_URL}/product/${productId}`,
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
