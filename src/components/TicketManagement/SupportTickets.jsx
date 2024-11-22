// src/components/SupportTickets/SupportTickets.jsx
import React, { useEffect, useState } from 'react';
import { fetchSupportTickets, updateSupportTicket, deleteSupportTicket, fetchUsers, insertLogEntry } from '../../services/supabaseService';
import './SupportTickets.css';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editUserId, setEditUserId] = useState('');
  const adminId = 1; // Replace with the actual admin ID

  useEffect(() => {
    const getTicketsAndUsers = async () => {
      try {
        const ticketData = await fetchSupportTickets();
        setTickets(ticketData);
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (err) {
        setError("could not fetch data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getTicketsAndUsers();
  }, []);

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setEditCategory(ticket.category);
    setEditStatus(ticket.status);
    setEditPriority(ticket.priority);
    setEditDescription(ticket.description);
    setEditUserId(ticket.user_id);
  };

  const handleUpdate = async () => {
    try {
      const changes = [];
      if (editingTicket.category !== editCategory) changes.push(`Category changed from ${editingTicket.category} to ${editCategory}`);
      if (editingTicket.status !== editStatus) changes.push(`Status changed from ${editingTicket.status} to ${editStatus}`);
      if (editingTicket.priority !== editPriority) changes.push(`Priority changed from ${editingTicket.priority} to ${editPriority}`);
      if (editingTicket.description !== editDescription) changes.push(`Description changed`);
      if (editingTicket.user_id !== editUserId) changes.push(`Assigned user changed from ${getUserEmail(editingTicket.user_id)} to ${getUserEmail(editUserId)}`);

      await updateSupportTicket(editingTicket.ticket_id, {
        category: editCategory,
        status: editStatus,
        priority: editPriority,
        description: editDescription,
        user_id: editUserId,
      });
      setTickets(tickets.map(ticket => ticket.ticket_id === editingTicket.ticket_id ? {
        ...ticket,
        category: editCategory,
        status: editStatus,
        priority: editPriority,
        description: editDescription,
        user_id: editUserId,
      } : ticket));
      await insertLogEntry(adminId, 'Edit Ticket', `Edited ticket ${editingTicket.ticket_id}: ${changes.join(', ')}`);
      setEditingTicket(null);
    } catch (err) {
      setError("could not update ticket");
      console.log(err);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      await deleteSupportTicket(ticketId);
      setTickets(tickets.filter(ticket => ticket.ticket_id !== ticketId));
      await insertLogEntry(adminId, 'Delete Ticket', `Deleted ticket ${ticketId}`);
    } catch (err) {
      setError("could not delete ticket");
      console.log(err);
    }
  };

  const getUserEmail = (userId) => {
    const user = users.find(user => user.user_id === userId);
    return user ? user.email : 'Unknown User';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="support-tickets">
      <h2>Support Tickets</h2>
      {editingTicket && (
        <div className="edit-form">
          <h3>Edit Ticket</h3>
          <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
            <option value="Technical Support">Technical Support</option>
            <option value="Product Inquiry">Product Inquiry</option>
            <option value="General Question">General Question</option>
          </select>
          <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <select value={editUserId} onChange={(e) => setEditUserId(e.target.value)}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>{user.email}</option>
            ))}
          </select>
          <button onClick={handleUpdate}>Update</button>
          <button className="cancel" onClick={() => setEditingTicket(null)}>Cancel</button>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Description</th>
              <th>Assigned User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.ticket_id}>
                <td>{ticket.category}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.description}</td>
                <td>{getUserEmail(ticket.user_id)}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(ticket)}>Edit</button>
                  <button className="deactivate" onClick={() => handleDelete(ticket.ticket_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportTickets;