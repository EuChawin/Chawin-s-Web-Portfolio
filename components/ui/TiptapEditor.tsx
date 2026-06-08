'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered, 
  Quote, Heading1, Heading2, Heading3, ImageIcon, Link as LinkIcon,
  Undo, Redo, RemoveFormatting
} from 'lucide-react'
import { uploadImageFromEditor } from '@/lib/actions/editor'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Setup syntax highlighting
const lowlight = createLowlight(common)

const MenuBar = ({ editor }: { editor: any }) => {
  const [isUploading, setIsUploading] = useState(false)

  if (!editor) return null

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const result = await uploadImageFromEditor(formData)
        
        if (result && 'url' in result) {
          editor.chain().focus().setImage({ src: result.url }).run()
        } else if (result && 'error' in result) {
          console.error('Upload error:', result.error)
        }
      } catch (error) {
        console.error('Upload failed', error)
      } finally {
        setIsUploading(false)
      }
    }
    input.click()
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const Button = ({ onClick, isActive = false, disabled = false, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded hover:bg-[var(--bg-surface-2)] transition-colors",
        isActive ? "bg-[var(--bg-surface-2)] text-[var(--accent)]" : "text-[var(--text-secondary)]",
        disabled ? "opacity-50 cursor-not-allowed" : ""
      )}
    >
      {children}
    </button>
  )

  const Divider = () => <div className="w-px h-6 bg-[var(--border)] mx-1" />

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--border)] bg-[var(--bg-surface)] rounded-t-lg sticky top-0 z-10">
      <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
        <Bold size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
        <Italic size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} title="Code">
        <Code size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear Formatting">
        <RemoveFormatting size={16} />
      </Button>

      <Divider />

      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
        <Heading1 size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
        <Heading2 size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
        <Heading3 size={16} />
      </Button>

      <Divider />

      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
        <List size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
        <ListOrdered size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
        <Quote size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
        <div className="flex items-center gap-0.5">
          <Code size={16} />
          <span className="text-[10px] font-bold">[]</span>
        </div>
      </Button>

      <Divider />

      <Button onClick={setLink} isActive={editor.isActive('link')} title="Link">
        <LinkIcon size={16} />
      </Button>
      <Button onClick={addImage} disabled={isUploading} title="Image">
        <ImageIcon size={16} className={isUploading ? "animate-pulse text-[var(--accent)]" : ""} />
      </Button>

      <Divider />

      <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        <Undo size={16} />
      </Button>
      <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        <Redo size={16} />
      </Button>
    </div>
  )
}

interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder: 'Write your story...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto mx-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[var(--accent)] underline underline-offset-2',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-[var(--bg-surface-2)] text-[var(--text-primary)] rounded-md p-4 font-mono text-sm overflow-x-auto my-4',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose-portfolio min-h-[500px] p-6 focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border border-[var(--border)] rounded-lg bg-[var(--bg)] overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {/* Hidden input to pass value in FormData */}
      <input type="hidden" name="content" value={editor?.getHTML() || ''} />
    </div>
  )
}
