"use client";

import React, { useState, useEffect } from "react";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import { Post } from "../../utils/type";
import LoadingUI from "../../components/LoadingUI";
import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({}); 
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId: string = sessionData.id;
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/post", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.posts) {
        const postsWithInteraction = data.posts.map((post: Post) => ({
          ...post,
          userInteraction: post.likedBy?.some(
            (u: { id: string }) => u.id === userId
          )
            ? "like"
            : post.dislikedBy?.some((u: { id: string }) => u.id === userId)
            ? "dislike"
            : "none",
        }));
        setPosts(postsWithInteraction);
        setFilteredPosts(postsWithInteraction); 
      } else {
        console.error("No posts found in the response");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
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

  const handleInteraction = async (
    postId: string,
    interactionType: "like" | "dislike"
  ) => {
    if (!userId) return;
    const post = filteredPosts.find((p) => p.id === postId);
    if (!post) return;
    console.log("post", post);
    let endpoint1: string,
      endpoint2: string | null = null;
    let newInteraction: "like" | "dislike" | "none";
    let likesChange = 0,
      dislikesChange = 0;

    if (interactionType === "like") {
      if (post.userInteraction === "like") {
        endpoint1 = "/api/post/like/decrement";
        newInteraction = "none";
        likesChange = -1;
      } else {
        endpoint1 = "/api/post/like/increment";
        if (post.userInteraction === "dislike") {
          endpoint2 = "/api/post/dislike/decrement";
        }
        newInteraction = "like";
        likesChange = 1;
        if (post.userInteraction === "dislike") {
          dislikesChange = -1;
        }
      }
    } else {
      if (post.userInteraction === "dislike") {
        endpoint1 = "/api/post/dislike/decrement";
        newInteraction = "none";
        dislikesChange = -1;
      } else {
        endpoint1 = "/api/post/dislike/increment";
        if (post.userInteraction === "like") {
          endpoint2 = "/api/post/like/decrement";
        }
        newInteraction = "dislike";
        dislikesChange = 1;
        if (post.userInteraction === "like") {
          likesChange = -1;
        }
      }
    }

    setFilteredPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.likes + likesChange,
              dislikes: p.dislikes + dislikesChange,
              userInteraction: newInteraction,
              liked_by:
                newInteraction === "like"
                  ? [...(p.likedBy || []), { id: userId }]
                  : (p.likedBy || []).filter((u) => u.id !== userId),
              disliked_by:
                newInteraction === "dislike"
                  ? [...(p.dislikedBy || []), { id: userId }]
                  : (p.dislikedBy || []).filter((u) => u.id !== userId),
            }
          : p
      )
    );

    try {
      const response = await fetch(endpoint1, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: userId }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(`Error ${interactionType}ing post:`, error);
    }

    if (endpoint2) {
      try {
        const response = await fetch(endpoint2, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: postId, user_id: userId }),
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error(`Error updating opposite interaction:`, error);
      }
    }

  };

  const handleReadmore = (postId: string) => {
    router.push(`blog/${postId}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if(val === "") return setFilteredPosts(posts);
    const filtered = posts.filter((item) => item.title.toLowerCase().includes(val.toLowerCase()));
    setFilteredPosts(filtered);
};

const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>, postId: string) => {
  setComments((prevComments) => ({
    ...prevComments,
    [postId]: e.target.value,
  }));
};

  const handleCommentSubmit = async (postId: string) => {
    setCommentLoading(true)
    const comment = comments[postId];
    if (!userId || !comment) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, user_id: userId, content: comment }),
      });
      
      const result = await response.json();
      console.log(result);

      if (result.status === 200) {
        toast.success("Comment added successfully!");
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: "",
        }));
        setCommentLoading(false);
        fetchData();
      } else {
        setCommentLoading(false);
        toast.error("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error(`Error adding comment:`, error);
      toast.error("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="bg-[#fdf0f4] h-full min-h-screen">
      <div className=" lg:mx-[20%] lg:w-[60%] w-full h-full sm:p-10 p-5">
        <div className="flex justify-between items-center pt-5 mb-6 gap-x-5">
          <input
            type="text"
            onChange={handleChange}
            value={search}
            placeholder="Search Posts"
            className=" w-full  h-10 px-3 py-2 border border-gray-400 rounded-md placeholder:text-gray-400"
          />
          <Link
            href="/blog/write"
            className="bg-orange-500 hover:bg-orange-600 text-nowrap  rounded-lg text-white font-semibold  items-center flex justify-center gap-x-2 w-fit h-fit p-2"
          >
            <IoMdAdd />
            Create Post
          </Link>
        </div>
        {loading && <LoadingUI />}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center  text-gray-600 text-2xl mt-10">
            No posts found
            </div>
            )}
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 border border-violet-100 shadow-xl rounded-xl mb-5"
          >
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-2">
              <div className="flex items-center w-36 justify-start gap-3">
                <Image
                  src={post.author.personalInfo.avatarUrl || "/user.svg"}
                  alt="User profile picture"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <h2 className="text-lg font-semibold text-gray-500">
                  {post.author.personalInfo.firstName}
                </h2>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="text-gray-400">{getRelativeTime(post.createdAt)}</div>
              </div>
            </div>

            <div className="mb-2">
              <Link
                className="font-bold text-2xl hover:underline"
                href={`/blog/${post.id}`}
              >
                {post.title}
              </Link>
              {post.image && (
                <div className="flex justify-center mb-2">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-[200px] h-[150px] mt-2 rounded-lg"
                  />
                </div>
              )}
              <div className="mt-2">
                <p className="text-lg text-wrap font-sans mt-4 tracking-wide whitespace-pre-line line-clamp-4">
                  {post?.content}
                </p>
                {post?.content.length > 50 && (
                  <h1
                    className="text-blue-700 hover:text-blue-900 underline cursor-pointer"
                    onClick={() => handleReadmore(post.id)}
                  >
                    Read more
                  </h1>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <div className="flex gap-x-4 items-center">
                <div className="flex items-center gap-x-1">
                  <button onClick={() => handleInteraction(post.id, "like")}>
                    {post.userInteraction === "like" ? (
                      <BiSolidLike className="size-6" fill="green" />
                    ) : (
                      <BiLike className="size-6" fill="green" />
                    )}
                  </button>
                  <p className="text-xl">{post.likes}</p>
                </div>
                <div className="flex items-center gap-x-1">
                  <button onClick={() => handleInteraction(post.id, "dislike")}>
                    {post.userInteraction === "dislike" ? (
                      <BiSolidDislike className="size-6" fill="red" />
                    ) : (
                      <BiDislike className="size-6" fill="red" />
                    )}
                  </button>
                  <p>{post.dislikes}</p>
                </div>
              </div>
              <div className="flex justify-between">
                <Link href={`/blog/${post.id}`}>
                  <p className="text-gray-400 text-base cursor-pointer">
                    {post.comments.length} comments
                  </p>
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <input
                type="text"
                onChange={(e) => handleCommentChange(e, post.id)} 
                value={comments[post.id] || ""}
                placeholder="Add a Comment"
                className="w-full px-3 py-2 border border-gray-400 rounded-md  placeholder:text-gray-400"
              />
            </div>
            <div className="flex justify-start mt-4">
              {comments[post.id]?.length > 0 && !commentLoading &&  (
                <button
                  className="text-white bg-violet-500 hover:bg-violet-600 rounded-md px-2 py-1"
                  onClick={async () => await handleCommentSubmit(post.id)}
                >
                  Add Comment
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;