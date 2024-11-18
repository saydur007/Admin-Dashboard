// src/components/FeedbackReview/FeedbackReview.jsx
import React, { useEffect, useState } from 'react';
import { fetchFeedback, updateFeedback, fetchUsers } from '../../services/supabaseService';
import './FeedbackReview.css';

const FeedbackReview = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [editRating, setEditRating] = useState('');
  const [editComments, setEditComments] = useState('');
  const [editIsAnonymous, setEditIsAnonymous] = useState(false);
  const [filterRating, setFilterRating] = useState('');
  const [summary, setSummary] = useState({ total: 0, averageRating: 0 });

  useEffect(() => {
    const getFeedbackAndUsers = async () => {
      try {
        const feedbackData = await fetchFeedback();
        setFeedbacks(feedbackData);
        const userData = await fetchUsers();
        setUsers(userData);
        calculateSummary(feedbackData);
      } catch (err) {
        setError("could not fetch data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getFeedbackAndUsers();
  }, []);

  const calculateSummary = (feedbackData) => {
    const total = feedbackData.length;
    const averageRating = total ? (feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0) / total).toFixed(2) : 0;
    setSummary({ total, averageRating });
  };

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setEditRating(feedback.rating);
    setEditComments(feedback.comments);
    setEditIsAnonymous(feedback.is_anonymous);
  };

  const handleUpdate = async () => {
    try {
      await updateFeedback(editingFeedback.feedback_id, {
        rating: editRating,
        comments: editComments,
        is_anonymous: editIsAnonymous,
      });
      const updatedFeedbacks = feedbacks.map(feedback => feedback.feedback_id === editingFeedback.feedback_id ? {
        ...feedback,
        rating: editRating,
        comments: editComments,
        is_anonymous: editIsAnonymous,
      } : feedback);
      setFeedbacks(updatedFeedbacks);
      calculateSummary(updatedFeedbacks);
      setEditingFeedback(null);
    } catch (err) {
      setError("could not update feedback");
      console.log(err);
    }
  };

  const getUserEmail = (userId) => {
    const user = users.find(user => user.user_id === userId);
    return user ? user.email : 'Anonymous';
  };

  const filteredFeedbacks = filterRating ? feedbacks.filter(feedback => feedback.rating === parseInt(filterRating)) : feedbacks;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="feedback-review">
      <h2>Feedback Review</h2>
      <div className="summary">
        <p>Total Feedback: {summary.total}</p>
        <p>Average Rating: {summary.averageRating}</p>
      </div>
      <div className="filter">
        <label>Filter by Rating:</label>
        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
          <option value="">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      {editingFeedback && (
        <div className="edit-form">
          <h3>Edit Feedback</h3>
          <input
            type="number"
            value={editRating}
            onChange={(e) => setEditRating(e.target.value)}
            placeholder="Rating (1-5)"
            min="1"
            max="5"
          />
          <textarea
            value={editComments}
            onChange={(e) => setEditComments(e.target.value)}
            placeholder="Comments"
          />
          <label>
            <input
              type="checkbox"
              checked={editIsAnonymous}
              onChange={(e) => setEditIsAnonymous(e.target.checked)}
            />
            Anonymous
          </label>
          <button onClick={handleUpdate}>Update</button>
          <button className="cancel" onClick={() => setEditingFeedback(null)}>Cancel</button>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Rating</th>
              <th>Comments</th>
              <th>Anonymous</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map(feedback => (
              <tr key={feedback.feedback_id}>
                <td>{getUserEmail(feedback.user_id)}</td>
                <td>{feedback.rating}</td>
                <td>{feedback.comments}</td>
                <td>{feedback.is_anonymous ? 'Yes' : 'No'}</td>
                <td>{new Date(feedback.submitted_at).toLocaleString()}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(feedback)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackReview;