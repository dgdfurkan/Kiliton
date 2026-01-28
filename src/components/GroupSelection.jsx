import React, { useState } from 'react';
import { createGroup, joinGroup } from '../services/groupService';
import { useAuth } from '../contexts/AuthContext';
import { Warehouse, LogIn, PlusCircle } from 'lucide-react';

export default function GroupSelection() {
  const [mode, setMode] = useState('join'); // 'join' or 'create'
  const [groupName, setGroupName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'create') {
        await createGroup(groupName, password, currentUser);
      } else {
        await joinGroup(groupName, password, currentUser);
      }
      // Success is handled by AuthContext updating the user object,
      // which will cause the parent component to switch views.
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Warehouse size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'join' ? 'Depo Grubuna Katıl' : 'Yeni Depo Grubu Kur'}
          </h2>
          <p className="text-gray-500 mt-2">
            Kapı şifrelerine erişmek için bir gruba dahil olmalısınız.
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grup Adı (Depo İsmi)
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Örn: Göksu Depo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grup Şifresi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'İşleniyor...' : (mode === 'join' ? 'Gruba Katıl' : 'Grubu Oluştur')}
          </button>
        </form>

        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-gray-600 text-sm mb-3">
            {mode === 'join' ? 'Grubunuz yok mu?' : 'Zaten bir grubunuz var mı?'}
          </p>
          <button
            onClick={() => {
              setMode(mode === 'join' ? 'create' : 'join');
              setError('');
              setGroupName('');
              setPassword('');
            }}
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {mode === 'join' ? (
              <>
                <PlusCircle size={18} /> Yeni Grup Oluştur
              </>
            ) : (
              <>
                <LogIn size={18} /> Mevcut Gruba Katıl
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
