import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

/** Rich-text writing space (ELA constructed response) built on Tiptap/ProseMirror. */
export function WritingSpace() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Write your response…</p>',
  });
  return <EditorContent editor={editor} />;
}
