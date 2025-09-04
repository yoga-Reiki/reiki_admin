import axios from "axios";

export async function getblogData() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/blog`,
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
            `${process.env.REACT_APP_URL}/blog`,
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

// update blog
export async function getBlogUpdate(formData) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_URL}/blog`,
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
      `${process.env.REACT_APP_URL}/blog/${blogId}`,
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

