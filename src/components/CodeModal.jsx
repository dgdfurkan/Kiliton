import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function CodeModal({ isOpen, onClose, onSave, initialData }) {
  const [formData, setFormData] = useState({
    buildingName: '',
    outerCode: '',
    innerCode: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        buildingName: '',
        outerCode: '',
        innerCode: '',
        notes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            {initialData ? 'Şifreyi Düzenle' : 'Yeni Şifre Ekle'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bina Adı / Adres *</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Örn: Mavi Site A Blok"
              value={formData.buildingName}
              onChange={e => setFormData({...formData, buildingName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dış Kapı</label>
                <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                placeholder="1234"
                value={formData.outerCode}
                onChange={e => setFormData({...formData, outerCode: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İç Kapı</label>
                <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                placeholder="5678"
                value={formData.innerCode}
                onChange={e => setFormData({...formData, innerCode: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows="3"
              placeholder="Zile basmayın, kargoyu güvenliğe bırakın vs."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-2">
            <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow flex items-center justify-center gap-2"
            >
                <Save size={20} />
                Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
