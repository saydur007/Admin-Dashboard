import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";
import { fetchSupportTickets, fetchUsers, updateSupportTicket, deleteSupportTicket } from "../../services/supabaseService";

const makeStyle = (status) => {
  if (status === 'Open') {
    return {
      background: 'rgb(255, 173, 173, 0.5)',
      color: 'red',
    };
  } else if (status === 'In-Progress') {
    return {
      background: 'rgb(255, 255, 173, 0.5)',
      color: 'orange',
    };
  } else if (status === 'Resolved') {
    return {
      background: 'rgb(173, 255, 173, 0.5)',
      color: 'green',
    };
  } else {
    return {
      background: 'rgb(173, 173, 255, 0.5)',
      color: 'blue',
    };
  }
};

export default function BasicTable() {
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
    <div className="Table">
      <h3 style={{ color: "#e0e0e0" }}>Support Tickets</h3>
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
      <TableContainer component={Paper} style={{ boxShadow: "0px 13px 20px 0px #00000050", backgroundColor: "#2e2e2e" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "#e0e0e0" }}>User</TableCell>
              <TableCell align="left" style={{ color: "#e0e0e0" }}>Category</TableCell>
              <TableCell align="left" style={{ color: "#e0e0e0" }}>Status</TableCell>
              <TableCell align="left" style={{ color: "#e0e0e0" }}>Priority</TableCell>
              <TableCell align="left" style={{ color: "#e0e0e0" }}>Description</TableCell>
              <TableCell align="left" style={{ color: "#e0e0e0" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.ticket_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row" style={{ color: "#e0e0e0" }}>
                  {getUserEmail(ticket.user_id)}
                </TableCell>
                <TableCell align="left" style={{ color: "#e0e0e0" }}>{ticket.category}</TableCell>
                <TableCell align="left">
                  <span className="status" style={makeStyle(ticket.status)}>{ticket.status}</span>
                </TableCell>
                <TableCell align="left" style={{ color: "#e0e0e0" }}>{ticket.priority}</TableCell>
                <TableCell align="left" style={{ color: "#e0e0e0" }}>{ticket.description}</TableCell>
                <TableCell align="left" className="Details">
                  <button onClick={() => handleEdit(ticket)} style={{ color: "#e0e0e0", backgroundColor: "#3b3b3b", border: "none", padding: "5px 10px", borderRadius: "5px" }}>Edit</button>
                  <button onClick={() => handleDelete(ticket.ticket_id)} style={{ color: "#e0e0e0", backgroundColor: "#3b3b3b", border: "none", padding: "5px 10px", borderRadius: "5px", marginLeft: "5px" }}>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}