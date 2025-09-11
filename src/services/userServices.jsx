import axios from "axios";

export async function getAllUser({ page: page, pageSize: pageSize }) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/users?page=${page}&limit=${pageSize}`,
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

// user block 
export async function getUserAccess({ userId }) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_URL}/users/${userId}/toggle-status`,
            {},
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

// course toggle edit access 
export async function getCourseEditAccess({ body }) {
    try {
        const response = await axios.patch(
            `${process.env.REACT_APP_URL}/courses/admin/access/`,
            body,
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

// get course Activity 
export async function getCourseActivity({userId, courseId}) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/courses/admin/${userId}/${courseId}/activity`,
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

