// app/components/Dropzone.jsx
'use client';
import { useDropzone } from 'react-dropzone';

export default function Dropzone({ onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop,
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-cyan-400 p-8 rounded-2xl text-center cursor-pointer transition-all hover:shadow-glow bg-surface text-white"
    >
      <input {...getInputProps()} />
      {isDragActive ? 'Drop the files here...' : 'Drag and drop images here or click to browse'}
    </div>
  );
}
