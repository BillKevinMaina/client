import React, { useState, useEffect } from 'react';
import { db, auth } from '../config/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function SuperAdminView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      setUsers(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("ARE YOU SURE? This cannot be undone.")) {
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
    }
  };

  const updateUserRole = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'users', selectedUser.id), { role: selectedUser.role });
    setSelectedUser(null);
    fetchUsers();
    alert("User role updated successfully!");
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/'; // Hard redirect to break the login loop
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-white">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-red-500">SUPER ADMIN CONTROL PANEL</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-red-900/20"
        >
          Logout & Exit
        </button>
      </div>
      
      {/* USER TABLE */}
      <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-widest">
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="p-8 text-center text-slate-500">Loading user database...</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="p-4 font-mono text-sm">{u.email}</td>
                  <td className="p-4 text-sm capitalize">{u.role || 'motorist'}</td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => setSelectedUser(u)} className="bg-blue-900 text-blue-200 px-3 py-1 rounded text-xs font-bold hover:bg-blue-800">VIEW</button>
                    <button onClick={() => setSelectedUser({ ...u, isEditing: true })} className="bg-amber-900 text-amber-200 px-3 py-1 rounded text-xs font-bold hover:bg-amber-800">EDIT</button>
                    <button onClick={() => deleteUser(u.id)} className="bg-red-900 text-red-200 px-3 py-1 rounded text-xs font-bold hover:bg-red-800">DELETE</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl">
            <h2 className="text-xl font-black mb-4">{selectedUser.isEditing ? 'Edit User Role' : 'View User Details'}</h2>
            <p className="mb-4 text-slate-400 text-xs font-mono bg-slate-950 p-2 rounded">ID: {selectedUser.id}</p>
            
            {selectedUser.isEditing ? (
              <form onSubmit={updateUserRole}>
                <label className="block text-xs uppercase text-slate-500 mb-1">Set Role</label>
                <select 
                  value={selectedUser.role} 
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})} 
                  className="w-full p-3 bg-slate-800 rounded-lg mb-6 border border-slate-700 text-white"
                >
                  <option value="motorist">Motorist</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setSelectedUser(null)} className="flex-1 p-3 bg-slate-700 rounded-lg font-bold">Cancel</button>
                  <button type="submit" className="flex-1 p-3 bg-red-600 rounded-lg font-bold">Save Changes</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-slate-500 text-xs uppercase">Email</p>
                  <p className="text-white font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase">Created At</p>
                  <p className="text-white font-semibold">{selectedUser.createdAt?.toDate().toLocaleDateString() || 'N/A'}</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-full p-3 bg-slate-700 rounded-lg mt-4 font-bold">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}