import React, { useState, useEffect } from 'react';
import { UserCheck, UserX } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function FriendRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/friends/requests`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch friend requests');
    }
  };

  const handleAccept = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/friends/accept/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Friend request accepted');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to accept friend request');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/friends/reject/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Friend request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject friend request');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.username}`}
                alt={request.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <span className="font-medium text-gray-800">
                  {request.username}
                </span>
                <p className="text-sm text-gray-500">{request.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(request._id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-md"
              >
                <UserCheck className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleReject(request._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <UserX className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No pending friend requests
          </p>
        )}
      </div>
    </div>
  );
}

export default FriendRequests;