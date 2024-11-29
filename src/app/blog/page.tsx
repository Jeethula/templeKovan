"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "../../utils/type";
import LoadingUI from "../../components/LoadingUI";
import { useRouter } from "next/navigation";
import { IoMdAdd } from "react-icons/io";
import withProfileCheck from "@/components/withProfileCheck";
import {  Heart, Share2 } from "lucide-react";
import { handleShare } from "@/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const sessionData = JSON.parse(sessionStorage.getItem("user") || "{}");
  const role = sessionData.role;
  const userId: string = sessionData.id;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 7;

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

// const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>, postId: string) => {
//   setComments((prevComments) => ({
//     ...prevComments,
//     [postId]: e.target.value,
//   }));
// };

  // const handleCommentSubmit = async (postId: string) => {
  //   setCommentLoading(true)
  //   const comment = comments[postId];
  //   if (!userId || !comment) return;

  //   const post = posts.find((p) => p.id === postId);
  //   if (!post) return;

  //   try {
  //     const response = await fetch("/api/comment", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ post_id: postId, user_id: userId, content: comment }),
  //     });
      
  //     const result = await response.json();
  //     console.log(result);

  //     if (result.status === 200) {
  //       setComments((prevComments) => ({
  //         ...prevComments,
  //         [postId]: "",
  //       }));
  //       setCommentLoading(false);
  //       toast.success("Comment added successfully!");
  //       fetchData();
  //     } else {
  //       setCommentLoading(false);
  //       toast.error("Failed to add comment. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error(`Error adding comment:`, error);
  //     toast.error("Network error. Please check your connection and try again.");
  //   }
  // };

  // Add this function to handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Calculate pagination values
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="bg-[#fdf0f4] h-full min-h-screen">
      <div className=" lg:mx-[20%] lg:w-[60%] w-full h-full sm:p-10 p-5">
       { role.includes("blogAdmin") && <div className="flex items-center pt-5 mb-6 gap-x-3">
          <input
            type="text"
            onChange={handleChange}
            value={search}
            placeholder="Search Anouncements"
            className=" w-full  h-10 px-3 py-2 border border-gray-400 rounded-md placeholder:text-gray-400"
          />
            <Link
            href="/blog/write"
            className="bg-gray-200 rounded-full p-3 text-black font-semibold flex items-center justify-center w-10 h-10 hover:bg-gray-400"
            >
            <IoMdAdd size={25} /> 
            </Link>
        </div>}
        {loading && <LoadingUI />}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center  text-gray-600 text-2xl mt-10">
            No posts found
            </div>
            )}
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-4 border border-violet-100 shadow-xl rounded-xl mb-5"
          >
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-2">
              <div className="flex items-center w-36 justify-start gap-3">
                {/* <Image
                  src={post?.author?.personalInfo?.avatarUrl || "/user.svg"}
                  alt="User profile picture"
                  width={30}
                  height={30}
                  className="rounded-full"
                /> */}
                <h2 className="text-lg font-semibold text-gray-500">
                  {post?.author?.personalInfo?.firstName}
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
              {post.video && (
                <div className="flex justify-center mb-2">
                  <video
                    src={post.video}
                    controls
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

            <div className="flex justify-between items-center pb-2">
                <div className="flex items-center gap-x-1">
                  <button onClick={() => handleInteraction(post.id, "like")}>
                    {post.userInteraction === "like" ? (
                      <Heart className="size-6" fill="red" stroke="red" />
                    ) : (
                      <Heart className="size-6" stroke="red" />
                    )}
                  </button>
                  { post.likes <= 0 ? 
                  <p className="text-xl">0</p>
                 : <p className="text-xl">{post.likes}</p>
                    }
                </div>
                
                <div className="flex items-center gap-x-1">
                  <button className="flex items-center gap-x-1" onClick={() => {handleShare(`${process.env.NEXT_PUBLIC_API_URL}/${post.id}`)}}>
                    <Share2 />  share
                  </button>
                </div>
              {/* <div className="flex justify-between">
                <Link href={`/blog/${post.id}`}>
                  <p className="text-gray-400 text-base cursor-pointer">
                    {post.comments.length} comments
                  </p>
                </Link>
              </div> */}
            </div>
            {/* <div className="mt-4">
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
                  className="text-white bg-violet-500 hover:bg-violet-600 font-semibold rounded-md px-2 py-1"
                  onClick={async () => await handleCommentSubmit(post.id)}
                >
                  Add Comment
                </button>
              )}
            </div> */}
          </div>
        ))}
        {filteredPosts.length > postsPerPage && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <PaginationItem key={idx + 1} className="hidden sm:inline-flex">
                    <PaginationLink
                      onClick={() => handlePageChange(idx + 1)}
                      isActive={currentPage === idx + 1}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem className="hidden sm:inline-flex">
                  <PaginationEllipsis />
                </PaginationItem>
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

// export default Posts;

const posts = () => {
  return <Posts />;
};

export default withProfileCheck(posts);
