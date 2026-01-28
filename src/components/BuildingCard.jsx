import React from 'react';
import { MapPin, KeyRound, FileText, Edit2, Trash2 } from 'lucide-react';

export default function BuildingCard({ code, role, onEdit, onDelete }) {
  const canEdit = role === 'admin' || role === 'helper';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4 hover:shadow-md transition-shadow relative">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
            <div className="mt-1 bg-blue-50 p-2 rounded-lg text-blue-600">
                <MapPin size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {code.buildingName}
                </h3>
                {/* Optional: Add address or other details if available */}
            </div>
        </div>

        {canEdit && (
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(code)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                    <Edit2 size={18} />
                </button>
                {role === 'admin' && (
                    <button
                        onClick={() => onDelete(code.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                <KeyRound size={14} />
                Dış Kapı
            </div>
            <div className="text-lg font-mono font-bold text-gray-800">
                {code.outerCode || '-'}
            </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                <KeyRound size={14} />
                İç Kapı
            </div>
            <div className="text-lg font-mono font-bold text-gray-800">
                {code.innerCode || '-'}
            </div>
        </div>
      </div>

      {code.notes && (
          <div className="mt-3 text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-2">
            <FileText size={16} className="text-yellow-600 shrink-0 mt-0.5" />
            <p>{code.notes}</p>
          </div>
      )}
    </div>
  );
}
