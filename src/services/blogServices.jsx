import axios from "axios";

export async function getblogData({ page, pageSize, query }) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/blogs?page=${page}&limit=${pageSize}&q=${query || ""}`,
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

// add blog 
export async function getAddBlog(formData) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_URL}/blogs`,
            formData,
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

// update blog
export async function getBlogUpdate(formData, blogId) {
    try {
        const response = await axios.patch(
            `${process.env.REACT_APP_URL}/blogs/${blogId}`,
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

// delete blog
export async function getBlogDelete(blogId) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_URL}/blogs/${blogId}`,
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

