// src/components/UserManagement/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import { fetchUsers, fetchUserProfiles, updateUser, updateUserProfile, deleteUser, insertLogEntry } from '../../services/supabaseService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editContactNumber, setEditContactNumber] = useState('');
  const adminId = 1; // Replace with the actual admin ID

  useEffect(() => {
    const getUsersAndProfiles = async () => {
      try {
        const userData = await fetchUsers();
        const profileData = await fetchUserProfiles();
        setUsers(userData);
        setProfiles(profileData);
      } catch (err) {
        setError("could not fetch data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getUsersAndProfiles();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditEmail(user.email);
    setEditRole(user.role);
    const profile = profiles.find(profile => profile.user_id === user.user_id);
    if (profile) {
      setEditFirstName(profile.first_name);
      setEditLastName(profile.last_name);
      setEditContactNumber(profile.contact_number);
    }
  };

  const handleUpdate = async () => {
    try {
      const changes = [];
      if (editingUser.email !== editEmail) changes.push(`Email changed from ${editingUser.email} to ${editEmail}`);
      if (editingUser.role !== editRole) changes.push(`Role changed from ${editingUser.role} to ${editRole}`);
      const profile = profiles.find(profile => profile.user_id === editingUser.user_id);
      if (profile) {
        if (profile.first_name !== editFirstName) changes.push(`First name changed from ${profile.first_name} to ${editFirstName}`);
        if (profile.last_name !== editLastName) changes.push(`Last name changed from ${profile.last_name} to ${editLastName}`);
        if (profile.contact_number !== editContactNumber) changes.push(`Contact number changed from ${profile.contact_number} to ${editContactNumber}`);
      }

      await updateUser(editingUser.user_id, { email: editEmail, role: editRole });
      await updateUserProfile(editingUser.user_id, { first_name: editFirstName, last_name: editLastName, contact_number: editContactNumber });
      setUsers(users.map(user => user.user_id === editingUser.user_id ? { ...user, email: editEmail, role: editRole } : user));
      setProfiles(profiles.map(profile => profile.user_id === editingUser.user_id ? { ...profile, first_name: editFirstName, last_name: editLastName, contact_number: editContactNumber } : profile));
      await insertLogEntry(adminId, 'Edit User', `Edited user ${editingUser.user_id}: ${changes.join(', ')}`);
      setEditingUser(null);
    } catch (err) {
      setError("could not update user");
      console.log(err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.user_id !== userId));
      setProfiles(profiles.filter(profile => profile.user_id !== userId));
      await insertLogEntry(adminId, 'Delete User', `Deleted user ${userId}`);
    } catch (err) {
      setError("could not delete user");
      console.log(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {editingUser && (
        <div className="edit-form">
          <h3>Edit User</h3>
          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="Email"
          />
          <select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Retailer">Retailer</option>
            <option value="Customer">Customer</option>
            <option value="Partner">Partner</option>
          </select>
          <input
            type="text"
            value={editFirstName}
            onChange={(e) => setEditFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            value={editLastName}
            onChange={(e) => setEditLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="text"
            value={editContactNumber}
            onChange={(e) => setEditContactNumber(e.target.value)}
            placeholder="Contact Number"
          />
          <button onClick={handleUpdate}>Update</button>
          <button className="cancel" onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const profile = profiles.find(profile => profile.user_id === user.user_id);
              return (
                <tr key={user.user_id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>{profile ? profile.first_name : ''}</td>
                  <td>{profile ? profile.last_name : ''}</td>
                  <td>{profile ? profile.contact_number : ''}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button className="deactivate" onClick={() => handleDelete(user.user_id)}>Deactivate</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;