import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

function PostFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts/feed`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        { content: newPost },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setNewPost('');
      fetchPosts();
      toast.success('Post created!');
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchPosts();
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleCreatePost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
            focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows="3"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 
              flex items-center gap-2"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {posts.map((post) => (
        <article key={post._id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author.username}`}
              alt={post.author.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{post.author.username}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className="text-gray-800 mb-4">{post.content}</p>
          <div className="flex items-center gap-6 text-gray-500">
            <button
              onClick={() => handleLike(post._id)}
              className="flex items-center gap-2 hover:text-red-500"
            >
              <Heart
                className={`h-5 w-5 ${
                  post.likes.some((like) => like._id === user._id)
                    ? 'fill-red-500 text-red-500'
                    : ''
                }`}
              />
              <span>{post.likes.length}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-indigo-500">
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default PostFeed; 