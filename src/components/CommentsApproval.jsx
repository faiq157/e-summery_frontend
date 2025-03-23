import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axiosInstance from "@/utils/http";

const CommentsApproval = ({ existingData, userRole }) => {

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const base_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    axiosInstance.get(`${base_URL}/approval/${existingData?._id}`)
      .then(response => {
        setComments(response.data.comments);
        console.log(response.data.comments);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  }, [existingData,userRole]);

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    // Send the comment to the backend
    axiosInstance.post(`${base_URL}/approval/${existingData?._id}`, {
      comment: newComment
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Comment added:', response.data);
      setComments([...comments, { text: newComment }]);
      setNewComment("");
    })
    .catch(error => {
      console.error('Error adding comment:', error);
    });
  };
  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {userRole !== "establishment" && existingData?.status !== "completed" && (
        <div className="flex justify-start mb-4">
          <Input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="border p-1 rounded w-full"
          />
          <Button onClick={handleAddComment} className="ml-2 px-4 py-2 rounded-full">
            Add
          </Button>
        </div>
      )}
      <div className="flex flex-col items-start">
        {comments.map((comment, index) => (
          <div key={index} className="bg-gray-200 p-2 rounded mb-2 w-3/4 ">
            {comment.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsApproval;