"use client";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { FaOm } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Import useRouter
import ThirumanjanamModal from "@/components/modals/ThirumanjanamModal";
import AbhisekamModal from "@/components/modals/AbisekamModal";
import HomeServiceCard from "@/components/HomeServiceCard";

import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    personalInfo: {
      firstName: string;
      avatarUrl: string;
    };
  };
  likes: number;
  comments: any[];
}

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleSubmitSuccess = async () => {
    //
  };


  useEffect(() => {
    const fetchLatestPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/post", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: 'no-store'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await res.json();
        if (data.posts && data.posts.length > 0) {
          // Sort posts by date and get the latest
          const sortedPosts = data.posts.sort((a: Post, b: Post) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setLatestPost(sortedPosts[0]);
        }
      } catch (error) {
        console.error("Error fetching latest post:", error);
        setError("Failed to load latest post");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestPost();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userFromStorage = sessionStorage.getItem("user");

        if (userFromStorage) {
          const user = JSON.parse(userFromStorage);
          // if (user.isfirstTimeLogin) {
          //   router.push("/profile");
          // }
          if (
            user.role.includes("Admin") ||
            user.role.includes("approver") ||
            user.role.includes("posuser")
          ) {
            console.log("User found in session storage");
          } else {
            console.log("Role not valid, redirecting to home");
            router.push("/");
          }
        } else {
          console.log("User not found in session storage");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        router.push("/");
      }
    };
    const fetchLatestPost = async () => {
      try {
        const res = await fetch("/api/post", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.posts && data.posts.length > 0) {
          setLatestPost(data.posts[0]); 
          console.log("Latest post:", data.posts[0]);
        }
      } catch (error) {
        console.error("Error fetching latest post:", error);
      }
    };
   fetchUserDetails()
    fetchLatestPost();
  }, [router, user]);

  return (
    <div className="bg-[#fdf0f4] w-full h-full min-w-screen min-h-screen flex flex-col items-center justify-start gap-y-3 px-3">
      {/* <h1 className="text-2xl font-semibold text-red-600 flex items-center gap-x-3 text-center">
        <FaOm />
        Good Morning,
      </h1> */}
      <div className="min-w-screen min-h-40 w-full bg-white rounded-lg shadow-lg flex flex-col p-2 mt-3">
        <div>
         <h1>Good Morning,<span> Jeethu LA</span> </h1>
        </div>
      </div>
      {/* <h1 className="text-xl font-semibold text-red-600 ">Sevas</h1> */}
      <div className="flex gap-x-4 overflow-x-auto w-full  py-4">
        <HomeServiceCard
          title="Thirumanjanam"
          imageSrc="https://i.ytimg.com/vi/OzEJnTs_bqU/maxresdefault.jpg"
          description="Participate in the sacred bathing ritual of the deity."
          modalComponent={<ThirumanjanamModal onSubmitSuccess={handleSubmitSuccess} />}
        />
        <HomeServiceCard
          title="Abisekam"
          imageSrc="https://chinnajeeyar.org/wp-content/uploads/2016/11/15032201_10154073675297205_4908543132323661187_n.jpg"
          description="Take part in the divine anointment ceremony."
          modalComponent={<AbhisekamModal onSubmitSuccess={handleSubmitSuccess} />}        />
      </div>
      <div className="text-white bg-[#663399] font-semibold text-lg text-center rounded-md w-full h-fit px-4 py-2 mx-4">
        Contribute
      </div>
            <div className="w-full px-4">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : latestPost ? (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-lg">
                  {latestPost.author.personalInfo.firstName.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold">{latestPost.author.personalInfo.firstName}</span>
              </div>
              <span className="text-gray-500 text-sm">
                {new Date(latestPost.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Link href={`/blog/${latestPost.id}`} className="block">
              <h3 className="text-xl font-bold mb-2 hover:text-purple-600">
                {latestPost.title}
              </h3>
              <p className="text-gray-600 line-clamp-2 mb-4">{latestPost.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>❤️ {latestPost.likes} likes</span>
                <span>💬 {latestPost.comments.length} comments</span>
              </div>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <p className="text-gray-500">No latest announcment available.</p>
          </div>
        )}
      </div>
    </div>
  );
}


