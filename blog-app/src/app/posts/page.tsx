"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  meta_description: string;
  created_at: string;
}

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return '';
    // Check if the URL is absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // If relative, ensure it starts with a leading slash
    return url.startsWith('/') ? url : `/${url}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Blog Posts</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link 
              href={`/posts/${post.id}`} 
              key={post.id}
              className="transform transition duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl">
                {post.image_url?.trim() ? (
                  <div className="relative h-48">
                    <Image
                      src={getImageUrl(post.image_url)}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {post.meta_description || post.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <time>{new Date(post.created_at).toLocaleDateString()}</time>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
