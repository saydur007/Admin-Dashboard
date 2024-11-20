// src/components/FeedbackReview/FeedbackReview.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FeedbackReview from './FeedbackReview';
import { fetchFeedback, updateFeedback, fetchUsers } from '../../services/supabaseService';

// Mock the fetchFeedback and fetchUsers functions
jest.mock('../../services/supabaseService', () => ({
  fetchFeedback: jest.fn(),
  updateFeedback: jest.fn(),
  fetchUsers: jest.fn(),
}));

const mockFeedback = [
  { feedback_id: 1, user_id: 1, rating: 5, comments: 'Great!', is_anonymous: false, submitted_at: '2023-01-01T00:00:00Z' },
  { feedback_id: 2, user_id: 2, rating: 4, comments: 'Good', is_anonymous: true, submitted_at: '2023-01-02T00:00:00Z' },
];

const mockUsers = [
  { user_id: 1, email: 'user1@example.com' },
  { user_id: 2, email: 'user2@example.com' },
];

describe('FeedbackReview', () => {
  beforeEach(() => {
    fetchFeedback.mockResolvedValue(mockFeedback);
    fetchUsers.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays feedback correctly', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText('Feedback Review')).toBeInTheDocument();
    });

    expect(screen.getByText('Great!')).toBeInTheDocument();
    expect(screen.getByText('Good')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });

  test('handles editing feedback correctly', async () => {
    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText('Great!')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Edit')[0]);

    fireEvent.change(screen.getByPlaceholderText('Rating (1-5)'), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText('Comments'), { target: { value: 'Average' } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(updateFeedback).toHaveBeenCalledWith(1, { rating: '3', comments: 'Average', is_anonymous: false });
    });

    expect(screen.getByText('Average')).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    fetchFeedback.mockRejectedValueOnce(new Error('Failed to fetch feedback'));

    render(<FeedbackReview />);

    await waitFor(() => {
      expect(screen.getByText('Error: could not fetch data')).toBeInTheDocument();
    });
  });
});