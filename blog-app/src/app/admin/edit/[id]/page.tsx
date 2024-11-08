"use client";
import { useState, useEffect, use } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter } from 'next/navigation';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import MenuBar from "@/../components/MenuBar";
import { TextStyleExtended } from '@/../components/FontSize'; // Replace TextStyle with TextStyleExtended
import Color from '@tiptap/extension-color';

interface Post {
  id: number;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  image_url: string;
  video_url: string;
  tags: string;
  status: 'published' | 'draft';
}

interface Props {
  params: Promise<{ id: string }>
}

export default function EditPost({ params }: Props) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyleExtended, // Use the extended TextStyle
      Color,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none min-h-[200px] max-w-none',
      },
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}?includeDraft=true`);
        if (!response.ok) throw new Error('Post not found');
        const data = await response.json();
        setPost(data);
        editor?.commands.setContent(data.content);
        setLoading(false);
      } catch {
        setError('Failed to load post');
        setLoading(false);
      }
    };

    if (id && editor) {
      fetchPost();
    }
  }, [id, editor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !editor) return;

    setSaving(true);
    try {
      const content = editor.getHTML();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, content }),
      });

      if (!response.ok) throw new Error('Failed to update post');
      router.push('/admin');
    } catch {
      setError('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!post) return;
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
            <p className="mt-2 text-sm text-gray-600">Update your blog post content and settings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={post.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div className="border rounded-md p-2">
                <MenuBar editor={editor} />
                <EditorContent editor={editor} className="min-h-[200px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  name="image_url"
                  value={post.image_url}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md  text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="video_url" className="block text-sm font-medium text-gray-700">Video URL</label>
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={post.video_url}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md  text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700">Meta Title</label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={post.meta_title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md  text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium  text-black">Meta Description</label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={post.meta_description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  text-black focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm text-slate-900 font-medium">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={post.tags}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300  text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={post.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md  text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="inline-flex items-center px-4 py-2  border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
