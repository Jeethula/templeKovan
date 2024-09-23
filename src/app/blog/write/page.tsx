"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const userId=sessionData.id;
  

  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      if (result.status ===200) {
        router.push("/blog");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-5 font-mono">
      <h1 className="font-semibold">
        Blogging: Because therapy is expensive and your cat's not a good
        listener
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
            onChange={handleChange}
            onFocus={() => setError((prev) => ({ ...prev, title: "" }))}
            className={`w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:outline-none ${
              error.title ? "border-red-500" : "focus:border-blue-500"
            }`}
          />
          {error.title && <p className="text-red-500">{error.title}</p>}
          {data.title.length !== 0 && <p>{data.title.length}/70</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="content" className="block text-xl font-semibold">
            Content
          </label>
          <textarea
            name="content"
            value={data.content}
            rows={5}
            onFocus={() => setError((prev) => ({ ...prev, content: "" }))}
            onChange={handleChange}
            className={`w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:outline-none h-auto ${
              error.content ? "border-red-500" : "focus:border-blue-500"
            }`}
          ></textarea>
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
            className="w-full border border-gray-400 p-2 rounded-md"
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
          <button className="bg-blue-500 text-white px-3 py-2 rounded-md">
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePost;
