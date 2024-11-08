"use client";
import { useEffect, useState, use } from 'react';
import { Metadata } from 'next';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  meta_title: string;
  meta_description: string;
}

interface Props {
  params: Promise<{ id: string }>
}

export default function Page({ params }: Props) {
  const [post, setPost] = useState<Post | null>(null);
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  useEffect(() => {
    if (id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setPost(data));
    }
  }, [id]);

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
    </div>
  );

  return (
    <article className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
          {post.meta_description && (
            <p className="text-lg text-gray-700 mb-6">{post.meta_description}</p>
          )}
        </header>

        {post.image_url?.trim() && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 bg-white rounded-lg shadow-sm p-8 mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.video_url?.trim() && (
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <iframe
              src={post.video_url}
              title={post.title}
              className="w-full h-[500px] rounded-lg shadow-lg"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </article>
  );
}
