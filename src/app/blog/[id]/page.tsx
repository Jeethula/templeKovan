"use client";
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingPageUi from "@/components/LoadingPageUi";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import toast from "react-hot-toast";

interface Comment {
  user_name: string;
  content: string;
  createdAt: string;
  author: {
    personalInfo: {
      firstName: string;
      avatarUrl: string;
    };
  };
}
interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  author: {
    id: string;
    personalInfo: {
      firstName: string;
      avatarUrl: string;
    };
  };
  comments: Comment[];
  image: string | null;
  user_name: string;
  userInteraction?: "like" | "dislike" | "none";
  likedBy: { id: string }[];
  dislikedBy: { id: string }[];
}

function Post({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState<string>("");
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId: string = sessionData.id;
  const role: string = sessionData.role;
  const [error, setError] = useState<{ comment: string }>({ comment: "" });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/post/${params.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const post = data.post;
      console.log(post);
      setPost({
        ...post,
        userInteraction:
          Array.isArray(post.likedBy) &&
          post.likedBy.some((u: { id: string }) => u.id === userId)
            ? "like"
            : Array.isArray(post.dislikedBy) &&
              post.dislikedBy.some((u: { id: string }) => u.id === userId)
            ? "dislike"
            : "none",
      });
      console.log(post);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      setError({ comment: "Comment is required" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          post_id: post?.id,
          user_id: userId,
        }),
      });
      if (response.ok) {
        toast.success("Comment added successfully!");
        setComment("");
        await fetchData();
      } else {
        toast.error("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (interactionType: "like" | "dislike") => {
    if (!post) return;

    let endpoint1 = "",
      endpoint2 = "",
      newInteraction: "like" | "dislike" | "none" = "none";
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
        if (post.userInteraction === "dislike") dislikesChange = -1;
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
        if (post.userInteraction === "like") likesChange = -1;
      }
    }

    setPost(
      (prevPost) =>
        prevPost && {
          ...prevPost,
          likes: prevPost.likes + likesChange,
          dislikes: prevPost.dislikes + dislikesChange,
          userInteraction: newInteraction,
          liked_by:
            newInteraction === "like"
              ? [...prevPost.likedBy, { id: userId }]
              : prevPost.likedBy.filter((user) => user.id !== userId),
          disliked_by:
            newInteraction === "dislike"
              ? [...prevPost.dislikedBy, { id: userId }]
              : prevPost.dislikedBy.filter((user) => user.id !== userId),
        }
    );

    try {
      await fetch(endpoint1, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post?.id, user_id: userId }),
      });
      if (endpoint2) {
        await fetch(endpoint2, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: post?.id, user_id: userId }),
        });
      }
    } catch (error) {
      console.error("Error updating interaction:", error);
    }
  };

  const getRelativeTime = (isoDate: string) => {
    const now = new Date();
    const date = new Date(isoDate);
    const diffInMs = now.getTime() - date.getTime();
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return days === 1 ? "1 day ago" : `${days} days ago`;
    if (hours > 0) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    if (minutes > 0)
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    return "Just now";
  };

  const handleDelete = async (postId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/post", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, authorId: userId }),
      });

      if (response.ok) {
        toast.success("Post deleted successfully!");
        router.push("/blog");
      } else {
        toast.error("Failed to delete post. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return post === null ? (
    <p>
      <LoadingPageUi />
    </p>
  ) : (
    <div className="bg-[#fdf0f4] w-full h-full min-w-screen min-h-screen p-5">
      <div className="mb-7 flex justify-between items-center pt-3 lg:mx-60 md:mx-40  ">
        <Link
          className="hover:underline text-orange-600  flex items-center gap-1"
          href="/blog"
        >
          <FaArrowLeft className="size-4" /> Back to Posts
        </Link>
        {post.author.id === userId ||
          (role == "Admin" && (
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-500 text-white rounded-md px-2 py-1 font-semibold"
            >
              Delete
            </button>
          ))}
      </div>
      <div >
        <div className="bg-white rounded-xl p-4 lg:mx-60 md:mx-40 mb-5 pt-5">
          <div className="flex justify-between items-center border-b border-gray-400 pb-4 mb-4">
            <div className="flex items-center w-36 justify-start gap-3">
              <Image
                src={post.author.personalInfo.avatarUrl || "/user.svg"}
                alt="image"
                width={32}
                height={32}
                className="rounded-full"
              />
              <h2 className="text-xl font-semibold">
                {post.author.personalInfo.firstName}
              </h2>
            </div>
            <div>
              <p>{getRelativeTime(post.createdAt)}</p>
            </div>
          </div>
          <h2 className="font-bold text-2xl mb-4">{post.title}</h2>
          {post.image && (
            <div className="flex justify-center mb-4">
              <Image
                src={post.image}
                alt="Post image"
                width={600}
                height={400}
                className="w-full h-auto mt-2"
              />
            </div>
          )}
          <p className="mb-4">{post.content}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-x-4 items-center">
              <div className="flex items-center gap-x-1">
                <button onClick={() => handleInteraction("like")}>
                  {post.userInteraction === "like" ? (
                    <BiSolidLike className="size-6" fill="green" />
                  ) : (
                    <BiLike className="size-6" fill="green" />
                  )}
                </button>
                <p className="text-xl">{post.likes}</p>
              </div>
              <div className="flex items-center gap-x-1">
                <button onClick={() => handleInteraction("dislike")}>
                  {post.userInteraction === "dislike" ? (
                    <BiSolidDislike className="size-6" fill="red" />
                  ) : (
                    <BiDislike className="size-6" fill="red" />
                  )}
                </button>
                <p className="text-xl">{post.dislikes}</p>
              </div>
            </div>
          </div>


          <div className="mb-5 mt-8">
            <form onSubmit={handleSubmit}>
              <textarea
                className={`w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:outline-none h-24 ${
                  error.comment ? "border-red-500" : "focus:border-blue-500"
                }`}
                onChange={handleChange}
                value={comment}
                placeholder="Write a comment..."
                onFocus={() => setError((prev) => ({ ...prev, comment: "" }))}
              ></textarea>
              {error.comment && <p className="text-red-500">{error.comment}</p>}
              <button
                type="submit"
                disabled={loading}
                className={`bg-violet-500 hover:bg-violet-600 text-white rounded-md px-3 py-2 font-semibold mt-5 ${
                  loading ? "cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting Comment...
                  </div>
                ) : (
                  "Post Comment"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="w-full lg:mx-60 md:mx-40 mb-5 pt-5" >
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
          {post.comments &&
            post.comments.map((comment, index) => (
              <div
                key={index}
                className="max-w-2xl bg-white  p-4 border border-gray-300 shadow-md rounded-2xl mb-5"
              >
                <div className="flex justify-between mb-2 items-center">
                  <div className="flex items-center gap-3">
                    <Image
                      src={comment.author.personalInfo.avatarUrl}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <h2 className="text-base text-gray-400">
                      {comment.author.personalInfo.firstName}
                    </h2>
                  </div>
                  <div>
                    <p className="text-base text-gray-400">
                      {getRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                </div>
                <p className="">{comment.content}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Post;