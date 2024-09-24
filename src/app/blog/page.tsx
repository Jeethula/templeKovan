"use client";

import React, { useState, useEffect } from 'react';
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";;
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { Post } from '../../utils/type';

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userId:string=sessionData.id;
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  console.log(user);
  

  useEffect(() => {    
    fetchData();
  }, []);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/post', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log(data, 'data');
    

        if (data.posts) {
          setPosts(data.posts.map((post: Post) => ({
            ...post,
            userInteraction: post.likedBy?.some((u: { id: string; }) => u.id === userId) ? 'like'
              : post.dislikedBy?.some((u: { id: string; }) => u.id === userId) ? 'dislike'
              : 'none'
          }))); 
        } else {
          console.error('No posts found in the response');
        }

    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (date: string) => {
    const currentTime = new Date();
    const postTime = new Date(date);
    const diff = currentTime.getTime() - postTime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else if (seconds > 0) {
      return "Just now";
    } else {
      return "Just now";
    }
  };

  const handleInteraction = async (postId: string, interactionType: 'like' | 'dislike') => {
    if (!userId) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    let endpoint1: string, endpoint2: string | null = null;
    let newInteraction: 'like' | 'dislike' | 'none';
    let likesChange = 0, dislikesChange = 0;

    if (interactionType === 'like') {
      if (post.userInteraction === 'like') {
        endpoint1 = '/api/post/like/decrement';
        newInteraction = 'none';
        likesChange = -1;
      } else {
        endpoint1 = '/api/post/like/increment';
        if (post.userInteraction === 'dislike') {
          endpoint2 = '/api/post/dislike/decrement';
        }
        newInteraction = 'like';
        likesChange = 1;
        if (post.userInteraction === 'dislike') {
          dislikesChange = -1;
        }
      }
    } else {
      if (post.userInteraction === 'dislike') {
        endpoint1 = '/api/post/dislike/decrement';
        newInteraction = 'none';
        dislikesChange = -1;
      } else {
        endpoint1 = '/api/post/dislike/increment';
        if (post.userInteraction === 'like') {
          endpoint2 = '/api/post/like/decrement';
        }
        newInteraction = 'dislike';
        dislikesChange = 1;
        if (post.userInteraction === 'like') {
          likesChange = -1;
        }
      }
    }

    setPosts(prevPosts => prevPosts.map(p =>
      p.id === postId
        ? {
            ...p,
            likes: p.likes + likesChange,
            dislikes: p.dislikes + dislikesChange,
            userInteraction: newInteraction,
            liked_by: newInteraction === 'like'
              ? [...(p.likedBy || []), { id: userId }]
              : (p.likedBy || []).filter(u => u.id !== userId),
            disliked_by: newInteraction === 'dislike'
              ? [...(p.dislikedBy || []), { id: userId }]
              : (p.dislikedBy || []).filter(u => u.id !== userId)
          }
        : p
    ));

    try {
      const response = await fetch(endpoint1, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, user_id: userId })
      });
      const result = await response.json();
    } catch (error) {
      console.error(`Error ${interactionType}ing post:`, error);
    }

    if (endpoint2) {
      try {
        const response = await fetch(endpoint2, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: postId, user_id: userId })
        });
        const result = await response.json();
      } catch (error) {
        console.error(`Error updating opposite interaction:`, error);
      }
    }
  };
  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch('/api/post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id:postId, authorId:userId })
      });

      if (response.ok) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
  <div className='bg-[#fdf0f4]'>
    <div className='mx-[20%] w-[50%]'>
      <div className='flex justify-between items-center pt-5 mb-6 gap-x-5'>
        <input type="text" placeholder='Search Posts' className='w-[80%] h-10 px-3 py-2 border border-gray-400 rounded-md  placeholder:text-gray-400' />
        <Link href='/blog/write' className='bg-violet-600 hover:bg-violet-700 rounded-lg text-white font-semibold items-center flex justify-center w-fit h-fit p-2'>Create Post</Link>
      </div>
      {posts.map((post) => (
        <div key={post.id} className=' bg-white p-4 border border-gray-300 shadow-lg rounded-xl mb-5'>
          <div className='flex justify-between items-center border-b border-gray-200 pb-3 mb-2'>
            <div className='flex items-center w-36 justify-start gap-3'>
              <Image 
                src={post.author.personalInfo.avatarUrl || '/user.svg'}
                alt="User profile picture"  
                width={30} 
                height={30}
                className="rounded-full"
              />
              <h2 className='text-lg font-semibold text-gray-500'>{post.author.personalInfo.firstName}</h2>
            </div>
            <div className='flex items-center gap-x-4'>
              {post.author.id === userId && (
                <button 
                  onClick={() => handleDelete(post.id)}
                  className='text-white bg-red-500 px-2 py-1 rounded-md'
                  aria-label="Delete post"
                >
                  delete
                </button>
              )}
              <div className='text-gray-400'>{getRelativeTime(post.createdAt)}</div>
            </div>
          </div>

          <div className='mb-2'>
            <Link className='font-bold text-2xl hover:underline' href={`/blog/${post.id}`}>{post.title}</Link>
            {post.image && (
              <div className='flex justify-center mb-2'>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-[200px] h-[150px] mt-2 rounded-lg"
                />
              </div>
            )}
            <div className='mt-2'>
              <p className='mb-4 w-full max-h-40 overflow-auto text-gray-700 tracking-wide p-2 leading-6 text-base'>{post.content}</p>
            </div>
          </div>

          <div className='flex justify-between items-center border-b border-gray-200 pb-2'>
            <div className='flex gap-3 items-center'>
              <div className='flex items-center'>
                <button onClick={() => handleInteraction(post.id, 'like')}>
                  {post.userInteraction === 'like' ? <BiSolidLike className='size-6' fill='green' /> : <BiLike className='size-6' fill='green' />}
                </button>
                <p className='text-xl'>{post.likes}</p>
              </div>
              <div className='flex items-center'>
                <button onClick={() => handleInteraction(post.id, 'dislike')}>
                  {post.userInteraction === 'dislike' ? <BiSolidDislike className='size-6' fill='red' /> : <BiDislike className='size-6' fill='red' />}
                </button>
                <p>{post.dislikes}</p>
              </div>
            </div>
            <div className='flex justify-between'>
              <p className='text-gray-400 text-base'>{post.comments.length} comments</p>
            </div>
          </div>

          <div className='mt-4'>
            <Link href={`/blog/${post.id}`}>
              <input type="text" placeholder='Add a Comment' className='w-full px-3 py-2 border border-gray-400 rounded-md bg-gray-100 placeholder:text-gray-400' />
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default Posts;