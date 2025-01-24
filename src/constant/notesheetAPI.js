import axiosInstance from "@/utils/http";



const base_URL = import.meta.env.VITE_APP_API_URL;

export const fetchNotesheets = async (userRole, status,storedToken) => {
    
    try {
        const response = await axiosInstance.get(`${base_URL}/notesheet/notesheets`, {
            params: { role: { $in: [userRole] }, status: status },
            headers:{
                Authorization:`${storedToken}`
            }
          
        });

        if (Array.isArray(response.data)) {
            const sortedNotesheets = response.data.sort((a, b) => {
                return new Date(b.timestamps.createdAt) - new Date(a.timestamps.createdAt);
            });
            return sortedNotesheets;
        } else {
            throw new Error("Invalid data format");
        }
    } catch (err) {
        throw new Error("Failed to fetch notesheets", err);
    }
};


export const fetchComments = async (notesheetId, storedToken) => {
    try {
        const response = await axiosInstance.get(`${base_URL}/notesheet/comments/${notesheetId}`, {
            headers: {
                'Authorization': ` ${storedToken}`,
            },
        });
        
        return response.data.comments; // Return comments array
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw new Error('Failed to fetch comments');
    }
};

export const addComment = async (notesheetId,formData, storedToken) => {
    try {
    
        const response = await axiosInstance.post(
            `${base_URL}/notesheet/add-comment/${notesheetId}`,
            formData,
            {
                headers: {
                    'Authorization': ` ${storedToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        return response.data.comment; // Return the newly added comment
    } catch (error) {
        console.error('Error adding comment:', error);
        throw new Error('Failed to add comment');
    }
};

export const deleteNotesheet =async (notesheetId, storedToken) => {
    try {
        const response = await axiosInstance.delete(`${base_URL}/notesheet/delete/${notesheetId}`, {
        headers:{
            Authorization:`${storedToken}`
        }
});
 return response.data;

} catch(error){
        console.error('Error deleting notesheet:', error);
        throw new Error('Failed to delete notesheet');
    }
}
export const editNotesheet = async (id, updatedData, storedToken) => {
    console.log("id",id,"This is Formdata",updatedData)
  try {
    const formData = new FormData();
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key]) formData.append(key, updatedData[key]);
    });

    const response = await axiosInstance.put(`${base_URL}/notesheet/edit/${id}`, formData, {
      headers: {
        Authorization: `${storedToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error editing notesheet:', error);
    throw new Error('Failed to edit notesheet');
  }
};

export const fetchNotesheetTracking = async (trackingId, storedToken) => {
    try {
        const response = await axiosInstance.get(`${base_URL}/track/${trackingId}`, {
            headers: {
                Authorization: ` ${storedToken}`,
            },
        });

        return response.data.data; 
    } catch (error) {
        console.error("Error fetching notesheet tracking data:", error);
        throw new Error("Failed to fetch notesheet tracking data");
    }
};