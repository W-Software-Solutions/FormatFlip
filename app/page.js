'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('png');
  const [convertedUrl, setConvertedUrl] = useState('');

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
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>🖼️ Image Converter</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ display: 'block', marginBottom: '1rem' }}
        />
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
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
          style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Convert
        </button>
      </form>

      {convertedUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Converted Image:</h2>
          <img src={convertedUrl} alt="Converted" style={{ maxWidth: '100%', marginBottom: '1rem' }} />
          <a href={convertedUrl} download={`converted.${format}`} style={{ color: '#0070f3' }}>
            Download Converted Image
          </a>
        </div>
      )}
    </div>
  );
}
