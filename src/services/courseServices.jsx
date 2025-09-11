import axios from "axios";

export async function getCoursesData({userId}) {
    try {
        const response = await axios.get(
            `${userId ? `${process.env.REACT_APP_URL}/courses?userId=${userId}` : `${process.env.REACT_APP_URL}/courses`}`,
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

// add courses 
export async function getAddCourses(formData) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_URL}/courses`,
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

// update courses
export async function getCoursesUpdate(formData, coursesId) {
    try {
        const response = await axios.patch(
            `${process.env.REACT_APP_URL}/courses/${coursesId}`,
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

// delete Courses
export async function getCoursesDelete(coursesId) {
    try {
        const response = await axios.delete(
            `${process.env.REACT_APP_URL}/courses/${coursesId}`,
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


