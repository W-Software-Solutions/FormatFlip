'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('png');
  const [convertedUrl, setConvertedUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('format', format);

    const res = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      alert('Failed to convert: ' + errorMsg);
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setConvertedUrl(url);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-center text-white">
        🚀 AI Image Format Converter
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-zinc-600 rounded-xl p-10 text-center cursor-pointer hover:bg-zinc-800 transition"
        >
          {file ? (
            <p className="text-sm text-green-400 font-mono">
              Selected: {file.name}
            </p>
          ) : (
            <p className="text-zinc-400">Drag and drop an image here, or click to select</p>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="bg-zinc-800 text-white p-2 rounded-md w-full"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
            <option value="bmp">BMP</option>
            <option value="tiff">TIFF</option>
            <option value="avif">AVIF</option>
          </select>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white p-2 rounded-md w-full"
          >
            Convert Image
          </button>
        </div>
      </form>

      {convertedUrl && (
        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Preview:</h2>
          <img src={convertedUrl} alt="Converted" className="max-w-full rounded-md mb-3" />
          <a
            href={convertedUrl}
            download={`converted.${format}`}
            className="text-indigo-400 hover:underline"
          >
            ⬇️ Download Converted Image
          </a>
        </div>
      )}
    </main>
  );
}
