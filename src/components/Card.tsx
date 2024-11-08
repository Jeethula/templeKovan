import React from 'react';
import Image from 'next/image';

interface PersonalInfo {
  firstName: string;
  avatarUrl: string;
}

interface Author {
  personalInfo: PersonalInfo;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  likes: number;
  comments: Array<unknown>;
}

interface CardProps {
  post: Post;
}

const Card: React.FC<CardProps> = ({ post }) => {
  const { title, content, author } = post;
  const { avatarUrl } = author.personalInfo;

  return (
    <div className="w-72 h-96 border border-gray-300 p-4 shadow-lg flex flex-col items-center justify-center">
     <h2 className="mt-4 text-xl font-semibold">{title}</h2>
      {avatarUrl ? (
        <Image src={avatarUrl} alt={title} width={100} height={100} className="mb-4" />
      ) : (
        <p className="mb-4">{content}</p>
      )}
    </div>
  );
};

export default Card;