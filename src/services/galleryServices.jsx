import axios from "axios";

export async function getAllGalleryImg() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/gallery`,
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

// add gallery image 
export async function getAddGalleryImg(formData) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_URL}/gallery`,
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

// update gallery image 
export async function getUpdateGalleryImg(formData, imageId) {
    try {
        const response = await axios.patch(
            `${process.env.REACT_APP_URL}/gallery/${imageId}`,
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

// delete gallery image
export async function getGalleryImgDelete(imageId) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_URL}/gallery/${imageId}`,
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