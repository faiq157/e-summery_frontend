import axios from "axios";

const base_URL = import.meta.env.VITE_APP_API_URL;

export const fetchNotesheets = async (userRole, status, storedToken) => {
    
    try {
        const response = await axios.get(`${base_URL}/notesheet/notesheets`, {
            params: { role: { $in: [userRole] }, status: status },
            headers: {
                Authorization: ` ${storedToken}`,
            },
        });

        if (Array.isArray(response.data)) {
            // Sort the notesheets based on the createdAt timestamp
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
        const response = await axios.get(`${base_URL}/notesheet/comments/${notesheetId}`, {
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

export const addComment = async (notesheetId, comment, userRole, storedToken) => {
    try {
        const formData = new FormData();
        formData.append('role', userRole);
        formData.append('comment', comment);

        const response = await axios.post(
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
        const response = await axios.delete(`${base_URL}/notesheet/delete/${notesheetId}`, {
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
  try {
    const formData = new FormData();
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key]) formData.append(key, updatedData[key]);
    });

    const response = await axios.put(`${base_URL}/notesheet/edit/${id}`, formData, {
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