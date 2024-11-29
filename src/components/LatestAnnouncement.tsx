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
  video?: string;
}

export default function LatestAnnouncement({ post }: { post: Post }) {
  if (!post) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <p className="text-gray-500">No latest announcement available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold text-lg">
            {post.author.personalInfo.firstName.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold">
            {post.author.personalInfo.firstName}
          </span>
        </div>
        <span className="text-gray-500 text-sm">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
      <Link href={`/blog/${post.id}`} className="block">
        <h3 className="text-xl font-bold mb-2 hover:text-purple-600">
          {post.title}
        </h3>
        {post.video && (
          <div className="flex justify-center mb-2">
            <video
              src={post.video}
              controls
              className="w-full h-auto mt-2 rounded-lg"
            />
          </div>
        )}
        <p className="text-gray-600 line-clamp-2 mb-4">
          {post.content}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>❤️ {post.likes} likes</span>
        </div>
      </Link>
    </div>
  );
}
