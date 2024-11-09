"use client";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { quotes }from "./data";
import Link from "next/link";
import Image from "next/image";
import { FaHandHoldingHeart, FaUsers } from "react-icons/fa";

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

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
 const [servicesLoading, setServicesLoading] = useState(true);
 const [username, setUsername] = useState<string[]>([]);
 const [isposuser, setIsposuser] = useState<boolean>(false);
 const [quote, setQuote] = useState("");


 useEffect(() => {
  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services/addservices');
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  fetchServices();
 }, []);

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
          setUsername(user.firstName);
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
          // if (user.isfirstTimeLogin) {
          //   router.push("/profile");
          // }
          if (
            user.role.includes("Admin") ||
            user.role.includes("approver") ||
            user.role.includes("posuser")
          ) {
            if (user.role.includes("posuser")) {
              setIsposuser(true);
            }
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

  const handlePosMode = () => {
    router.push("/posuser");
  };

  const handleContributeClick = () => {
    router.push("/contributions");
  };

  const handleservices = () => {
    router.push("/services");
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning !";
    if (hour < 16) return "Good Afternoon !";
    return "Good Evening !";
  };

  return (
    <div className="bg-[#fdf0f4] w-full h-full min-w-screen min-h-screen flex flex-col justify-start px-2">
      <div className="min-w-screen min-h-40 w-full bg-white rounded-lg shadow-lg flex flex-col px-3 py-4 mt-3">
        <div className="flex justify-between ">
        <div className="flex flex-col">
  <h1 className="text-xl font-semibold text-gray-800">
    {getGreeting()}
  </h1>
  <h1 className="mt-2 text-gray-600 font-normal  ">Welcome to Sri Renukka Akkama Temple's official app</h1>
  <h1 className="mt-4 text-gray-700 font-medium">{quote}</h1>

</div>
         {isposuser && 
         <div onClick={handlePosMode} className="min-w-16 min-h-16 max-h-16 max-w-16 p-2 flex items-center text-center rounded-md  bg-red-500 text-sm text-white font-medium">
           POS Mode
         </div>
         }
        </div>
      </div>
  <div className="text-black font-semibold mt-4 text-xl">Quick Links</div>
<div className="flex gap-x-4 overflow-x-auto w-full py-4">
  {servicesLoading ? (
    <div className="animate-pulse flex space-x-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 rounded-lg w-64 h-48"></div>
      ))}
    </div>
  ) : services.length > 0 ? (
    services.map((service) => (
      <div 
        key={service.id}
        onClick={handleservices}
        className="flex-none w-64 bg-white rounded-lg shadow-lg overflow-hidden"
      >
        {service.image ? (
          <div className="relative h-32 w-full">
            <Image
              src={service.image}
              alt={service.name}
              layout="fill"
              objectFit="cover"
              className="h-28"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
              <h1 className="font-semibold text-lg text-white">{service.name}</h1>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <h3 className="font-semibold text-black text-lg mb-2">{service.name}</h3>
            <p className="text-gray-600 line-clamp-3">{service.description}</p>
          </div>
        )}
      </div>
    ))
  ) : (
    <div className="w-full text-center text-gray-500">
      No services available
    </div>
  )}

</div>
<div
  onClick={handleContributeClick}
  className="bg-purple-600 rounded-xl p-4 transform hover:scale-105 transition-all duration-300 shadow-2xl"
>
  <div className="flex flex-col md:flex-row items-center gap-2">
    <div className="flex-1 text-white">
      <div className="flex items-center gap-3 mb-4">
        <FaHandHoldingHeart className="text-3xl animate-pulse" />
        <h2 className="text-xl font-semibold">Together make a difference</h2>
      </div>
      <p className="mb-4 text-lg opacity-90">
        Even a small amount can help, as it can make a big impact in many ways
      </p>
      <button className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:bg-purple-700 hover:text-white transition-colors flex items-center gap-2">
        <FaUsers />
        Contribute now
      </button>
    </div>
  </div>
</div>

      <h1 className="text-black font-semibold mt-4 text-xl  mb-4" >Latest Announcemet</h1>
            <div className="w-full px-1">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : latestPost ? (
          <div className="bg-white rounded-xl shadow-lg  p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold text-lg">
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
                {/* <span>💬 {latestPost.comments.length} comments</span> */}
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


