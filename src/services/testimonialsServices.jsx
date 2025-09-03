import axios from "axios";

export async function getTestimonialsData() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_URL}/testimonials`,
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

// add testimonials 
export async function getAddTestimonials(formData) {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_URL}/testimonials`,
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

// update testimonials
export async function getTestimonialsUpdate(formData) {
    try {
        const response = await axios.put(
            `${process.env.REACT_APP_URL}/testimonials`,
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

// delete testimonials
export async function getTestimonialsDelete(testimonialId) {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_URL}/testimonials/${testimonialId}`,
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

