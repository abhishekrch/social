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

}