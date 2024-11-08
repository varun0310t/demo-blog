import { Editor } from '@tiptap/react';
import React from 'react';

interface Props {
  editor: Editor | null;
}

export default function MenuBar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-1 rounded-md border text-gray-700 ${
          editor.isActive('bold') ? 'bg-gray-200' : ''
        }`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-1 rounded-md border text-gray-700 ${
          editor.isActive('italic') ? 'bg-gray-200' : ''
        }`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-3 py-1 rounded-md border text-gray-700 ${
          editor.isActive('strike') ? 'bg-gray-200' : ''
        }`}
      >
        Underline
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-3 py-1 rounded-md border text-gray-700 ${
          editor.isActive('underline') ? 'bg-gray-200' : ''
        }`}
      >
        Underline
      </button>

      {/* Text Color */}
      <input
        type="color"
        onChange={(e) =>
          editor.chain().focus().setColor(e.target.value).run()
        }
        value={editor.getAttributes('textStyle').color || '#000000'}
        className="h-6 w-6"
      />

      {/* Font Size */}
      <select
        onChange={(e) => {
          const size = e.target.value;
          if (size === 'default') {
            editor.chain().focus().unsetFontSize().run(); // Access unsetFontSize directly
          } else {
            editor.chain().focus().setFontSize(size).run(); // Access setFontSize directly
          }
        }}
        value={editor.getAttributes('textStyle').fontSize || 'default'}
        className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-100"
      >
        <option value="default">Font Size</option>
        <option value="12">12px</option>
        <option value="14">14px</option>
        <option value="16">16px</option>
        <option value="18">18px</option>
        <option value="20">20px</option>
        <option value="24">24px</option>
        <option value="28">28px</option>
      </select>
    </div>
  );
}
