import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { ArrowLeft, User, Shield, ShieldCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.groupId) return;

    const db = getFirestore();
    const q = query(collection(db, "users"), where("groupId", "==", currentUser.groupId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleRoleChange = async (userId, newRole) => {
    const db = getFirestore();
    try {
        await updateDoc(doc(db, "users", userId), {
            role: newRole
        });
    } catch (error) {
        console.error("Error updating role:", error);
        alert("Rol güncellenemedi.");
    }
  };

  const handleKickUser = async (userId) => {
    if (window.confirm("Bu kullanıcıyı gruptan çıkarmak istediğinize emin misiniz?")) {
        const db = getFirestore();
        try {
            // Remove groupId from user
            await updateDoc(doc(db, "users", userId), {
                groupId: null,
                role: 'member' // Reset role
            });

            // Optional: Remove from group's members array if we strictly maintained it
            // const groupRef = doc(db, "groups", currentUser.groupId);
            // await updateDoc(groupRef, { members: arrayRemove(userId) });

        } catch (error) {
            console.error("Error kicking user:", error);
            alert("Kullanıcı atılamadı.");
        }
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
      return <div className="p-4">Yetkiniz yok.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Grup Ayarları</h1>
      </div>

      <div className="p-4 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-700">Üyeler ({members.length})</h2>
                <p className="text-sm text-gray-500">Grup ID: {currentUser.groupId}</p>
            </div>

            <div className="divide-y">
                {loading ? (
                    <div className="p-4 text-center text-gray-500">Yükleniyor...</div>
                ) : (
                    members.map(member => (
                        <div key={member.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${member.role === 'admin' ? 'bg-purple-100 text-purple-600' : member.role === 'helper' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {member.role === 'admin' ? <ShieldCheck size={20} /> : member.role === 'helper' ? <Shield size={20} /> : <User size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{member.name || member.email}</h3>
                                    <p className="text-xs text-gray-500 capitalize">{member.role === 'admin' ? 'Yönetici' : member.role === 'helper' ? 'Yardımcı' : 'Kurye'}</p>
                                </div>
                            </div>

                            {/* Actions - Don't allow editing self or other admins (unless master admin logic exists, keeping simple) */}
                            {member.id !== currentUser.uid && (
                                <div className="flex items-center gap-2">
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    >
                                        <option value="member">Kurye</option>
                                        <option value="helper">Yardımcı</option>
                                        {/* <option value="admin">Yönetici</option> -- Keep one admin for simplicity? Or allow multiple. Let's allow multiple. */}
                                        <option value="admin">Yönetici</option>
                                    </select>

                                    <button
                                        onClick={() => handleKickUser(member.id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Gruptan Çıkar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
