// src/components/ContentManagement/ContentManagement.jsx
import React, { useEffect, useState } from 'react';
import { fetchContent, addContent, updateContent, deleteContent, fetchEvents, addEvent, updateEvent, deleteEvent, fetchEventRegistrations, addEventRegistration, fetchUsers, insertLogEntry } from '../../services/supabaseService';
import './ContentManagement.css';

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newContent, setNewContent] = useState({ title: '', content_type: 'Article', content: '', category: '', created_by: 1 });
  const [newEvent, setNewEvent] = useState({ event_name: '', description: '', event_date: '', created_by: 1 });
  const [newRegistration, setNewRegistration] = useState({ user_id: '', event_id: '' });

  // Define missing state variables and their setters
  const [editTitle, setEditTitle] = useState('');
  const [editContentType, setEditContentType] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editEventName, setEditEventName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editEventDate, setEditEventDate] = useState('');

  const adminId = 1; // Replace with the actual admin ID

  useEffect(() => {
    const getData = async () => {
      try {
        const contentData = await fetchContent();
        setContent(contentData);
        const eventData = await fetchEvents();
        setEvents(eventData);
        const registrationData = await fetchEventRegistrations();
        setRegistrations(registrationData);
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (err) {
        setError("could not fetch data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleAddContent = async () => {
    try {
      const addedContent = await addContent(newContent);
      setContent([...content, ...addedContent]);
      await insertLogEntry(adminId, 'Add Content', `Added content: ${newContent.title}`);
      setNewContent({ title: '', content_type: 'Article', content: '', category: '', created_by: 1 });
    } catch (err) {
      setError("could not add content");
      console.log(err);
    }
  };

  const handleAddEvent = async () => {
    try {
      const addedEvent = await addEvent(newEvent);
      setEvents([...events, ...addedEvent]);
      await insertLogEntry(adminId, 'Add Event', `Added event: ${newEvent.event_name}`);
      setNewEvent({ event_name: '', description: '', event_date: '', created_by: 1 });
    } catch (err) {
      setError("could not add event");
      console.log(err);
    }
  };

  const handleRegisterEvent = async () => {
    try {
      const addedRegistration = await addEventRegistration(newRegistration);
      setRegistrations([...registrations, ...addedRegistration]);
      await insertLogEntry(adminId, 'Register Event', `Registered user ${newRegistration.user_id} for event ${newRegistration.event_id}`);
      setNewRegistration({ user_id: '', event_id: '' });
    } catch (err) {
      setError("could not register for event");
      console.log(err);
    }
  };

  const handleEditContent = (content) => {
    setEditingContent(content);
    setEditTitle(content.title);
    setEditContentType(content.content_type);
    setEditContent(content.content);
    setEditCategory(content.category);
  };

  const handleUpdateContent = async () => {
    try {
      await updateContent(editingContent.content_id, {
        title: editTitle,
        content_type: editContentType,
        content: editContent,
        category: editCategory,
      });
      setContent(content.map(c => c.content_id === editingContent.content_id ? {
        ...c,
        title: editTitle,
        content_type: editContentType,
        content: editContent,
        category: editCategory,
      } : c));
      await insertLogEntry(adminId, 'Update Content', `Updated content: ${editTitle}`);
      setEditingContent(null);
    } catch (err) {
      setError("could not update content");
      console.log(err);
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      await deleteContent(contentId);
      setContent(content.filter(c => c.content_id !== contentId));
      await insertLogEntry(adminId, 'Delete Content', `Deleted content ID: ${contentId}`);
    } catch (err) {
      setError("could not delete content");
      console.log(err);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEditEventName(event.event_name);
    setEditDescription(event.description);
    setEditEventDate(event.event_date);
  };

  const handleUpdateEvent = async () => {
    try {
      await updateEvent(editingEvent.event_id, {
        event_name: editEventName,
        description: editDescription,
        event_date: editEventDate,
      });
      setEvents(events.map(e => e.event_id === editingEvent.event_id ? {
        ...e,
        event_name: editEventName,
        description: editDescription,
        event_date: editEventDate,
      } : e));
      await insertLogEntry(adminId, 'Update Event', `Updated event: ${editEventName}`);
      setEditingEvent(null);
    } catch (err) {
      setError("could not update event");
      console.log(err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(e => e.event_id !== eventId));
      await insertLogEntry(adminId, 'Delete Event', `Deleted event ID: ${eventId}`);
    } catch (err) {
      setError("could not delete event");
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
    <div className="content-management">
      <h2>Content Management</h2>
      <div className="add-form">
        <h3>Add New Content</h3>
        <input
          type="text"
          value={newContent.title}
          onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
          placeholder="Title"
        />
        <select value={newContent.content_type} onChange={(e) => setNewContent({ ...newContent, content_type: e.target.value })}>
          <option value="Article">Article</option>
          <option value="Tutorial">Tutorial</option>
          <option value="Video">Video</option>
        </select>
        <textarea
          value={newContent.content}
          onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
          placeholder="Content"
        />
        <input
          type="text"
          value={newContent.category}
          onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
          placeholder="Category"
        />
        <button onClick={handleAddContent}>Add Content</button>
      </div>
      {editingContent && (
        <div className="edit-form">
          <h3>Edit Content</h3>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <select value={editContentType} onChange={(e) => setEditContentType(e.target.value)}>
            <option value="Article">Article</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Video">Video</option>
          </select>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Content"
          />
          <input
            type="text"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            placeholder="Category"
          />
          <button onClick={handleUpdateContent}>Update</button>
          <button className="cancel" onClick={() => setEditingContent(null)}>Cancel</button>
        </div>
      )}
      <div className="add-form">
        <h3>Add New Event</h3>
        <input
          type="text"
          value={newEvent.event_name}
          onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
          placeholder="Event Name"
        />
        <textarea
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          placeholder="Description"
        />
        <input
          type="datetime-local"
          value={newEvent.event_date}
          onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
          placeholder="Event Date"
        />
        <button onClick={handleAddEvent}>Add Event</button>
      </div>
      {editingEvent && (
        <div className="edit-form">
          <h3>Edit Event</h3>
          <input
            type="text"
            value={editEventName}
            onChange={(e) => setEditEventName(e.target.value)}
            placeholder="Event Name"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="datetime-local"
            value={editEventDate}
            onChange={(e) => setEditEventDate(e.target.value)}
            placeholder="Event Date"
          />
          <button onClick={handleUpdateEvent}>Update</button>
          <button className="cancel" onClick={() => setEditingEvent(null)}>Cancel</button>
        </div>
      )}
      <div className="table-container">
        <h3>Educational Resources</h3>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Content</th>
              <th>Category</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {content.map(c => (
              <tr key={c.content_id}>
                <td>{c.title}</td>
                <td>{c.content_type}</td>
                <td>{c.content}</td>
                <td>{c.category}</td>
                <td>{getUserEmail(c.created_by)}</td>
                <td>{new Date(c.created_at).toLocaleString()}</td>
                <td className="actions">
                  <button onClick={() => handleEditContent(c)}>Edit</button>
                  <button className="deactivate" onClick={() => handleDeleteContent(c.content_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-container">
        <h3>Events</h3>
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Description</th>
              <th>Event Date</th>
              <th>Created By</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e.event_id}>
                <td>{e.event_name}</td>
                <td>{e.description}</td>
                <td>{new Date(e.event_date).toLocaleString()}</td>
                <td>{getUserEmail(e.created_by)}</td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
                <td className="actions">
                  <button onClick={() => handleEditEvent(e)}>Edit</button>
                  <button className="deactivate" onClick={() => handleDeleteEvent(e.event_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-container">
        <h3>Event Registrations</h3>
        <div className="add-form">
          <h3>Register for Event</h3>
          <select value={newRegistration.user_id} onChange={(e) => setNewRegistration({ ...newRegistration, user_id: e.target.value })}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.user_id} value={user.user_id}>{user.email}</option>
            ))}
          </select>
          <select value={newRegistration.event_id} onChange={(e) => setNewRegistration({ ...newRegistration, event_id: e.target.value })}>
            <option value="">Select Event</option>
            {events.map(event => (
              <option key={event.event_id} value={event.event_id}>{event.event_name}</option>
            ))}
          </select>
          <button onClick={handleRegisterEvent}>Register</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Event</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(r => (
              <tr key={r.registration_id}>
                <td>{getUserEmail(r.user_id)}</td>
                <td>{events.find(e => e.event_id === r.event_id)?.event_name || 'Unknown Event'}</td>
                <td>{new Date(r.registration_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentManagement;