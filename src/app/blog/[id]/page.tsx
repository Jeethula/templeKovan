"use client";
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingPageUi from "@/components/LoadingPageUi";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"; // Adjust the import path as necessary

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
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId: string = sessionData.id;
  const role: string = sessionData.role;
  const router = useRouter();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");

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
      setEditedTitle(post.title);
      setEditedContent(post.content);
      console.log(post);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      console.log("Post deleted successfully!");
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch('/api/post', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedTitle,
          content: editedContent,
          authorId: userId,
          post_id: post?.id,
          role: role
        }),
      });

      if (response.ok) {
        toast.success("Post updated successfully!");
        setEditMode(false);
        await fetchData();
      } else {
        toast.error("Failed to update post. Please try again.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      console.log("Post updated successfully!");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedTitle(post?.title || "");
    setEditedContent(post?.content || "");
  };  
  return post === null ? (
    <p>
      <LoadingPageUi />
    </p>
  ) : (
    <div className="bg-[#fdf0f4] w-full h-full min-w-screen min-h-screen p-5">
      <div className="mb-7 flex justify-between items-center pt-3 lg:mx-60 md:mx-40  ">
        <Link
          className="hover:underline text-red-600  flex items-center gap-1"
          href="/blog"
        >
          <FaArrowLeft className="size-4" /> Back to Posts
        </Link>
        <div className="flex gap-2">
          {(post?.author.id == userId ||
            role == "blogAdmin") && (
              <>
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 text-white rounded-lg px-4 py-1 font-semibold"
                >
                  Edit
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="bg-red-500 text-white rounded-lg px-4 py-1 font-semibold">
                      Delete
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#663399]">Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this post? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 font-semibold" onClick={() => handleDelete(post.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
        </div>
      </div>
      <div>
        <div className="bg-white rounded-xl p-4 lg:mx-60 md:mx-40 mb-5 pt-5">
          <div className="flex justify-between items-center border-b border-gray-400 pb-4 mb-4">
            <div className="flex items-center w-36 justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-semibold">
              {post.author.personalInfo.firstName.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold">
              {post.author.personalInfo.firstName}
              </h2>
            </div>
            <div>
              <p>{getRelativeTime(post.createdAt)}</p>
            </div>
          </div>
          {editMode ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:outline-none mb-4"
              />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:outline-none h-24 mb-4"
              ></textarea>
              <div className="flex justify-end gap-2">
                
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white rounded-md px-3 py-1 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-green-600 text-white rounded-md px-3 py-1 font-semibold"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;