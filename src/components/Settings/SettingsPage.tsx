import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { User as UserIcon, Image as ImageIcon, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim());
  const [preview, setPreview] = useState<string | null>(user?.avatar ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let avatar = user?.avatar ?? undefined;
      if (file) avatar = await toBase64(file);

      const [first, ...rest] = name.split(' ');
      const last = rest.join(' ');
      updateUser({ firstName: first || user?.firstName, lastName: last || user?.lastName, avatar });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-xl font-semibold text-white mb-4">Profile Settings</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Display name</label>
            <Input icon={UserIcon} placeholder="First and last name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Profile picture</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-slate-300" />
            </div>
          </div>
          <Button onClick={handleSave} icon={Save} loading={saving} className="w-full">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


