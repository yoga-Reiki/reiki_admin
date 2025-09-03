import axios from "axios";

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