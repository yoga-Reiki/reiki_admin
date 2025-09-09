import axios from "axios";

export async function getProductData({ page, pageSize, query }) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/products?page=${page}&limit=${pageSize}&q=${query || ""}`,
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
            `${process.env.REACT_APP_URL}/products`,
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
        const response = await axios.patch(
            `${process.env.REACT_APP_URL}/products/${productId}`,
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

// delete product
export async function getProductDelete(productId) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_URL}/products/${productId}`,
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

