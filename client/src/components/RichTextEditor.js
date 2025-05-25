import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const alignments = ["left", "center", "right", "justify"];

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="btn"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="btn"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="btn"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="btn"
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => {
          const url = prompt("Вставьте ссылку:");
          if (!url) return;

          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          }

          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
        className="btn"
      >
        🔗
      </button>
      <button
        type="button"
        onClick={() => {
          const url = prompt("URL изображения:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        className="btn"
      >
        🖼
      </button>

      {/* Кнопки выравнивания */}
      {alignments.map((alignment) => (
        <button
          key={alignment}
          type="button"
          onClick={() => editor.chain().focus().setTextAlign(alignment).run()}
          className={`btn ${
            editor.isActive({ textAlign: alignment }) ? "is-active" : ""
          }`}
          title={`Align ${alignment}`}
        >
          {alignment[0].toUpperCase()}
        </button>
      ))}
    </div>
  );
};

const RichTextEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      TextAlign.configure({
        types: ["heading", "paragraph"], // куда применять выравнивание
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border p-2 rounded bg-white">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-[300px] overflow-y-auto"
        style={{ whiteSpace: "normal" }}
      />
    </div>
  );
};

export default RichTextEditor;
