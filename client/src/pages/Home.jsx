import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, UserPlus, UserMinus, Users } from 'lucide-react';
import FriendRequests from '../components/FriendRequests';
import PostFeed from '../components/PostFeed';

function Home() {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if(user) {
            fetchFriends();
        }
    }, [user]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/friends`,
              {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              }
            );
            setFriends(response.data);
          } catch (error) {
            toast.error('Failed to fetch friends');
          }      
    }

    const fetchRecommendations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/friends/recommendations`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setRecommendations(response.data);
    } catch (error) {
      toast.error('Failed to fetch recommendations');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/search?q=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/friends/request`,
        { friendId: userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Friend request sent!');
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/friends/${friendId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchFriends();
      toast.success('Friend removed');
    } catch (error) {
      toast.error('Failed to remove friend');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <Users className="h-16 w-16 text-indigo-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to FriendConnect
        </h1>
        <p className="text-gray-600">Please login or register to continue</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {users.map((searchedUser) => (
              <div
                key={searchedUser._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${searchedUser.username}`}
                    alt={searchedUser.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {searchedUser.username}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {searchedUser.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddFriend(searchedUser._id)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Add Friend
                </button>
              </div>
            ))}
            <div className="lg:col-span-2">
             <PostFeed />
                  </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Your Friends
            </h2>
            <div className="space-y-4">
              {friends.map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${friend.username}`}
                      alt={friend.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium text-gray-800">
                      {friend.username}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <UserMinus className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {friends.length === 0 && (
                <p className="text-gray-500 text-center py-4">No friends yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended Friends</h2>
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <div
                  key={recommendation._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${recommendation.username}`}
                      alt={recommendation.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <span className="font-medium text-gray-800">
                        {recommendation.username}
                      </span>
                      <p className="text-sm text-gray-500">
                        {recommendation.mutualFriendsCount} mutual friends
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(recommendation._id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              ))}
              {recommendations.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No recommendations available
                </p>
              )}
            </div>
          </div>          
            
          <div className="mt-8">
            <FriendRequests />
          </div>
        </div>
      </div>
    </div>
  );

}
