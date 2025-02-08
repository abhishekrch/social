import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import toast from 'react-hot-toast';


function Home() {
    const { user } = useAuth();
    const [friends, setFriends] = useState([]);

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

}
