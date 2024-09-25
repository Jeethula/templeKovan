"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PostData {
  title: string;
  content: string;
  image: string;
}

interface ErrorState {
  title: string;
  content: string;
}

function WritePost() {
  const [data, setData] = useState<PostData>({
    title: "",
    content: "",
    image: "",
  });
  const [error, setError] = useState<ErrorState>({ title: "", content: "" });
  const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
  const userId = sessionData.id;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(data);
    
    if (!data.title || !data.content) {
      if (!data.title) {
        setError((prev) => ({
          ...prev,
          title: "Title is required",
        }));
      }
      if (!data.content) {
        setError((prev) => ({
          ...prev,
          content: "Content is required",
        }));
      }
      return;
    }

    setLoading(true);
    try {
      console.log(data);
      
      const response = await fetch(
        "/api/post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, authorId: userId }),
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        toast.success("Post created successfully!");
        router.push("/blog");
      } else {
        toast.error("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fdf0f4] h-full w-full min-h-screen min-w-screen">
      <div className="pt-10">
        <div className="max-w-2xl mx-60 bg-white p-4 rounded-xl shadow-md">
          <h1 className="font-semibold text-xl text-orange-500">
            Write a new post
          </h1>
          <form className="mt-5" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="title" className="block text-xl font-semibold">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={data.title}
                maxLength={70}
                placeholder="Enter title ( 70 characters max )"
                onChange={handleChange}
                onFocus={() => setError((prev) => ({ ...prev, title: "" }))}
                className={`w-full border border-gray-300 p-2 mt-2 mb-2 rounded-md focus:ring-2 focus:outline-none ${
                  error.title ? "border-red-500" : "focus:border-blue-500"
                }`}
              />
              {error.title && <p className="text-red-500">{error.title}</p>}
              {data.title.length !== 0 && <p>{data.title.length} / 70</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="content" className="block text-xl font-semibold">
                Content
              </label>
              <textarea
                name="content"
                value={data.content}
                rows={5}
                placeholder="Type your content"
                onFocus={() => setError((prev) => ({ ...prev, content: "" }))}
                onChange={handleChange}
                className={`w-full border border-gray-300 p-2 mt-2 mb-2 rounded-md focus:ring-2 focus:outline-none h-auto ${
                  error.content ? "border-red-500" : "focus:border-blue-500"
                }`}
              ></textarea>
              {data.content.length !== 0 && <p>{data.content.length} letters</p>}
              {error.content && <p className="text-red-500">{error.content}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="image" className="block text-xl font-semibold">
                Image (Optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-400 p-2 mt-2 mb-2 rounded-md"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 max-w-full h-auto"
                />
              )}
            </div>
            <div className="mb-5">
              <button
                type="submit"
                disabled={loading}
                className={`bg-violet-500 hover:bg-violet-600 text-white px-3 py-2 rounded-md ${
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
                    Posting...
                  </div>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritePost;