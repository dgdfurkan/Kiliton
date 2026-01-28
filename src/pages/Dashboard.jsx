import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import GroupSelection from '../components/GroupSelection';
import BuildingCard from '../components/BuildingCard';
import SearchBar from '../components/SearchBar';
import CodeModal from '../components/CodeModal';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [codes, setCodes] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState(null);

  // Logout Handler
  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Çıkış yapılamadı');
    }
  }

  // Firestore Listener
  useEffect(() => {
    if (!currentUser?.groupId) return;

    const db = getFirestore();
    const q = query(collection(db, "codes"), where("groupId", "==", currentUser.groupId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const codesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCodes(codesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching codes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Search Filtering
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCodes(codes);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = codes.filter(code =>
        code.buildingName.toLowerCase().includes(lowerTerm) ||
        (code.notes && code.notes.toLowerCase().includes(lowerTerm))
      );
      setFilteredCodes(filtered);
    }
  }, [searchTerm, codes]);

  // Handlers
  const handleEdit = (code) => {
    setEditingCode(code);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu şifreyi silmek istediğinize emin misiniz?")) {
        try {
            const db = getFirestore();
            await deleteDoc(doc(db, "codes", id));
        } catch (error) {
            console.error("Error deleting code:", error);
            alert("Silme işlemi başarısız oldu.");
        }
    }
  };

  const handleSaveCode = async (data) => {
    const db = getFirestore();
    try {
      if (editingCode) {
        // Update existing
        await updateDoc(doc(db, "codes", editingCode.id), {
          ...data,
          updatedAt: new Date(),
          updatedBy: currentUser.uid
        });
      } else {
        // Create new
        await addDoc(collection(db, "codes"), {
          ...data,
          groupId: currentUser.groupId,
          createdAt: new Date(),
          createdBy: currentUser.uid
        });
      }
      setIsModalOpen(false);
      setEditingCode(null);
    } catch (error) {
      console.error("Error saving code:", error);
      alert("Kaydetme sırasında bir hata oluştu.");
    }
  };

  // If user is not in a group yet, show Group Selection
  if (!currentUser.groupId) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white shadow p-4 flex justify-between items-center z-10">
            <h1 className="font-bold text-lg text-gray-800">Kurye App</h1>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                <LogOut size={20} />
            </button>
        </div>
        <GroupSelection />
      </div>
    );
  }

  const canAdd = currentUser.role === 'admin' || currentUser.role === 'helper';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-20"> {/* pb-20 for safe area if we had bottom nav */}

      {/* Header */}
      <div className="bg-blue-600 px-4 pt-6 pb-12 rounded-b-3xl shadow-lg relative">
        <div className="flex justify-between items-center mb-6 text-white">
            <div>
                <h1 className="text-2xl font-bold">Merhaba, {currentUser.displayName?.split(' ')[0] || 'Kurye'} 👋</h1>
                <p className="text-blue-100 text-sm">{currentUser.groupId} Ekibi</p>
            </div>
            <div className="flex gap-2">
                {currentUser.role === 'admin' && (
                     <button
                        onClick={() => navigate('/settings')}
                        className="p-2 bg-blue-500 hover:bg-blue-400 rounded-full transition-colors"
                     >
                        <Settings size={20} />
                     </button>
                )}
                <button
                    onClick={handleLogout}
                    className="p-2 bg-blue-500 hover:bg-blue-400 rounded-full transition-colors"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>

        {/* Search Bar (Overlapping) */}
        <div className="absolute -bottom-7 left-4 right-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      {/* Content */}
      <div className="mt-12 px-4 flex-1">
        {loading ? (
            <div className="text-center py-10 text-gray-500">Yükleniyor...</div>
        ) : filteredCodes.length === 0 ? (
            <div className="text-center py-10">
                {searchTerm ? (
                    <p className="text-gray-500">"{searchTerm}" için sonuç bulunamadı.</p>
                ) : (
                    <div className="flex flex-col items-center text-gray-400">
                         <p>Henüz kayıtlı bina şifresi yok.</p>
                         {canAdd && <p className="text-sm mt-2">Aşağıdaki + butonuna basarak ekleyin.</p>}
                    </div>
                )}
            </div>
        ) : (
            filteredCodes.map(code => (
                <BuildingCard
                    key={code.id}
                    code={code}
                    role={currentUser.role}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))
        )}
      </div>

      {/* FAB - Add Button */}
      {canAdd && (
          <button
            onClick={() => {
              setEditingCode(null);
              setIsModalOpen(true);
            }}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 z-40"
          >
            <Plus size={28} />
          </button>
      )}

      {/* Modal */}
      <CodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCode}
        initialData={editingCode}
      />
    </div>
  );
}
