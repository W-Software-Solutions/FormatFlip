// app/components/SettingsPanel.jsx
'use client';
export default function SettingsPanel({ settings, setSettings }) {
  return (
    <div className="grid grid-cols-3 gap-4 text-white">
      <input
        type="number"
        placeholder="Width"
        className="bg-surface p-2 rounded-xl"
        value={settings.width}
        onChange={e => setSettings(prev => ({ ...prev, width: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Height"
        className="bg-surface p-2 rounded-xl"
        value={settings.height}
        onChange={e => setSettings(prev => ({ ...prev, height: e.target.value }))}
      />
      <input
        type="range"
        min="10"
        max="100"
        className="accent-primary"
        value={settings.quality}
        onChange={e => setSettings(prev => ({ ...prev, quality: e.target.value }))}
      />
    </div>
  );
}
