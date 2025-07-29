// app/components/ImageCard.jsx
'use client';
export default function ImageCard({ file, onConvert }) {
  return (
    <div className="p-4 bg-surface rounded-2xl text-white shadow-lg flex flex-col gap-2">
      <img src={URL.createObjectURL(file)} className="w-full h-40 object-cover rounded-lg" />
      <button
        onClick={() => onConvert(file)}
        className="bg-primary py-2 rounded-xl font-semibold hover:opacity-80"
      >
        Convert
      </button>
    </div>
  );
}
