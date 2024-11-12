"use client";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { quotes } from "./data";
import Link from "next/link";
import Image from "next/image";
import { FaHandHoldingHeart, FaOm, FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";


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
}

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  isSeva: boolean;
}

function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [isposuser, setIsposuser] = useState<boolean>(false);
  const [quote, setQuote] = useState("");
  const [showingCard, setShowingCard] = useState<'welcome' | 'special'>('welcome');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services/addservices");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  // useEffect(() => {
  //   const fetchRecentContributions = async () => {
  //     const res = await fetch("/api/services/getRecentContributions", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const data = await res.json();

  //     console.log(data.user);
  //   };
  //   fetchRecentContributions();
  // }, []);

  useEffect(() => {
    const fetchLatestPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/post", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
        if (data.posts && data.posts.length > 0) {
          const sortedPosts = data.posts.sort(
            (a: Post, b: Post) =>
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
        }
      } catch (error) {
        console.error("Error fetching latest post:", error);
      }
    };
    fetchUserDetails();
    fetchLatestPost();
  }, [router, user]);

  const handleSpecialclick = () => {
    router.push("/special");
  };

  useEffect(() => {
    // Only set up random selection if there are special events
    if (services.filter(service => !service.isSeva).length > 0) {
      // Randomly choose which card to show initially
      setShowingCard(Math.random() < 0.5 ? 'welcome' : 'special');
      
      // Change card every 10 seconds
      const timer = setInterval(() => {
        setShowingCard(prev => prev === 'welcome' ? 'special' : 'welcome');
      }, 10000);
      
      return () => clearInterval(timer);
    }
  }, [services]);

  const handlePosMode = () => {
    router.push("/posuser");
  };

  const handleContributeClick = () => {
    router.push("/contributions");
  };

  const handleservices = () => {
    router.push("/services");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning !";
    if (hour < 16) return "Good Afternoon !";
    return "Good Evening !";
  };

  return (
    <div className="bg-[#fdf0f4] w-full h-full min-w-screen min-h-screen flex flex-col justify-start px-2 md:px-6 lg:px-12">
      {/* Content wrapper */}
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Welcome/Special Card section */}
        <div className="md:grid md:grid-cols-2 md:gap-6 mt-3">
          {/* Left card */}
          <AnimatePresence mode="wait">
            {(showingCard === 'welcome' || services.filter(service => !service.isSeva).length === 0) ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="min-h-[200px] w-full bg-white rounded-lg shadow-lg flex flex-col px-3 py-4 md:h-full"
              >
                {/* Welcome card content */}
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <h1 className="text-xl font-semibold text-gray-800">
                      {getGreeting()}
                    </h1>
                    <h1 className="mt-2 text-gray-600 text-md font-normal">
                      Welcome to Sri Renukka Akkama Temple&apos;s official place
                    </h1>
                  </div>
                  {isposuser ? (
                    <div onClick={handlePosMode} className="min-w-16 min-h-16 max-h-16 max-w-16 p-2 flex items-center text-center rounded-md bg-red-500 text-sm text-white font-medium">
                      POS Mode
                    </div>
                  ) : (
                    <div><FaOm /></div>
                  )}
                </div>
                <h1 className="mt-4 text-gray-800 font-medium bg-violet-100 p-2 rounded-md">
                  &quot;{quote}&quot;
                </h1>
              </motion.div>
            ) : (
              <motion.div
                key="special-events"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="min-h-[200px] w-full rounded-lg shadow-lg md:h-full"
              >
                {(() => {
                  const specialEvents = services.filter(service => !service.isSeva);
                  const randomEvent = specialEvents[Math.floor(Math.random() * specialEvents.length)];
                  
                  if (!randomEvent) return null;

                  return (
                    <div onClick={handleSpecialclick} className="bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700] rounded-xl p-4 shadow-[0_0_15px_rgba(253,185,49,0.3)] h-[200px] overflow-hidden">
                      <div className="relative h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-xl font-bold text-[#4A3800] tracking-wide">
                            Special Event
                            {/* <div className="h-1 w-20 bg-[#4A3800] mt-1 rounded-full opacity-60"></div> */}
                          </h2>
                          <div className="w-10 h-10 rounded-full bg-[#4A3800] flex items-center justify-center">
                            <FaOm className="text-[#FFD700] text-xl" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col space-y-2 h-[140px]">
                          {randomEvent.image && (
                            <div className="relative h-24 w-full overflow-hidden rounded-lg border-2 border-[#4A3800]/20">
                              <Image
                                src={randomEvent.image}
                                alt={randomEvent.name}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3800]/60 to-transparent"></div>
                            </div>
                          )}
                          <h3 className="font-bold text-lg text-[#4A3800] leading-tight truncate">
                            {randomEvent.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right side contribution section for desktop */}
          <div className="hidden md:block">
            <div className="h-full" onClick={handleContributeClick}>
              <div className="bg-violet-500 rounded-xl p-6 h-full transform hover:scale-105 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <div className="flex-1 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <FaHandHoldingHeart className="text-3xl animate-pulse" />
                      <h2 className="text-xl font-semibold">
                        Together make a difference
                      </h2>
                    </div>
                    <p className="mb-4 text-lg opacity-90">
                      Even a small amount can help, as it can make a big impact
                      in many ways
                    </p>
                    <button className="bg-white text-violet-600 px-6 py-2 rounded-full font-bold hover:bg-purple-700 hover:text-white transition-colors flex items-center gap-2">
                      <FaUsers />
                      Contribute now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links section */}
        <div className="text-black font-semibold mt-8 text-xl"> Book Seva</div>
        <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 w-full py-4">
          {servicesLoading ? (
            // Skeleton grid for desktop
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          ) : (
            // Service cards with responsive grid
            services
              .filter(service => service.isSeva)
              .map((service) => (
                <div
                  key={service.id}
                  onClick={handleservices}
                  className="flex-none w-64 md:w-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
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
                        <h1 className="font-semibold text-lg text-white">
                          {service.name}
                        </h1>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <h3 className="font-semibold text-black text-lg mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>

        {/* Contribution section - visible only on mobile */}
        <div className="md:hidden relative h-[200px] mt-6">
          <div className="relative h-[200px] overflow-hidden" onClick={handleContributeClick}>
            <div className="bg-violet-500 mt-2 rounded-xl p-4 transform hover:scale-105 transition-all duration-300 ">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <FaHandHoldingHeart className="text-3xl animate-pulse" />
                    <h2 className="text-xl font-semibold">
                      Together make a difference
                    </h2>
                  </div>
                  <p className="mb-4 text-lg opacity-90">
                    Even a small amount can help, as it can make a big impact
                    in many ways
                  </p>
                  <button className="bg-white text-violet-600 px-6 py-2 rounded-full font-bold hover:bg-purple-700 hover:text-white transition-colors flex items-center gap-2">
                    <FaUsers />
                    Contribute now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Announcement section */}
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="col-span-full">
            <h1 className="text-black font-semibold text-xl mb-4">
              Latest Announcement
            </h1>
          </div>
          <div className="col-span-full lg:col-span-2">
            <div className="w-full px-1">
              {isLoading ? (
                <div className="w-full px-1">
                  <div className="rounded-xl p-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                    <div className="space-y-3 mt-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
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
                        {latestPost.author.personalInfo.firstName
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <span className="font-semibold">
                        {latestPost.author.personalInfo.firstName}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(latestPost.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/blog/${latestPost.id}`} className="block">
                    <h3 className="text-xl font-bold mb-2 hover:text-purple-600">
                      {latestPost.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {latestPost.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>❤️ {latestPost.likes} likes</span>
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
        </div>
      </div>
    </div>
  );
}

export default HomePage;

