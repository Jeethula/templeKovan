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

export async function getServices(): Promise<{ services: Service[] }> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/services/addservices`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store" // Match Dpage.tsx caching strategy
    });

    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return { services: [] };
  }
}

export async function getLatestPost(): Promise<{ posts: Post[] }> {
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/post`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store" // Match Dpage.tsx caching strategy
    });

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest post:", error);
    return { posts: [] };
  }
}