import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const COLORS = [
  '#f59e0b', '#ef4444', '#22c55e', '#3b82f6',
  '#a855f7', '#ec4899', '#f97316', '#ffffff', '#000000',
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Détails du projet…',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // IMPORTANT : Met à jour l'éditeur quand on clique sur "Modifier" dans l'Admin

    useEffect(() => {
      if (!editor) return;

      if (content && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien', prev);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor border border-[var(--glass)] rounded-lg overflow-hidden bg-[#0d1620]">
      {/* TOOLBAR */}
      <div className="tiptap-toolbar flex flex-wrap gap-1 p-2 bg-[#16222e] border-b border-[var(--glass)]">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded ${editor.isActive('bold') ? 'bg-[var(--accent)] text-black' : 'hover:bg-gray-700'}`}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded ${editor.isActive('italic') ? 'bg-[var(--accent)] text-black' : 'hover:bg-gray-700'} italic`}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded ${editor.isActive('underline') ? 'bg-[var(--accent)] text-black' : 'hover:bg-gray-700'} underline`}>U</button>
        
        <div className="w-[1px] bg-gray-600 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-[var(--accent)] text-black' : 'hover:bg-gray-700'}`}>H1</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-[var(--accent)] text-black' : 'hover:bg-gray-700'}`}>H2</button>

        <div className="w-[1px] bg-gray-600 mx-1" />

        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className="p-2 hover:bg-gray-700">⬅</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className="p-2 hover:bg-gray-700">☰</button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className="p-2 hover:bg-gray-700">➡</button>

        <div className="w-[1px] bg-gray-600 mx-1" />

        <button type="button" onClick={setLink} className={`p-2 rounded ${editor.isActive('link') ? 'bg-[var(--accent)] text-black' : 'hover:bg-gray-700'}`}>🔗</button>
        
        {/* Couleurs */}
        <div className="flex gap-1 items-center ml-2">
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => editor.chain().focus().setColor(color).run()}
              className="w-5 h-5 rounded-full border border-gray-500"
              style={{ background: color }}
            />
          ))}
          <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} className="text-xs px-2 opacity-50">✕</button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;