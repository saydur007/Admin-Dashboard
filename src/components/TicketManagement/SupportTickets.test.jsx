// src/components/SupportTickets/SupportTickets.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SupportTickets from './SupportTickets';
import { fetchSupportTickets, updateSupportTicket, deleteSupportTicket, fetchUsers, insertLogEntry } from '../../services/supabaseService';

// Mock the fetch functions
jest.mock('../../services/supabaseService', () => ({
  fetchSupportTickets: jest.fn(),
  updateSupportTicket: jest.fn(),
  deleteSupportTicket: jest.fn(),
  fetchUsers: jest.fn(),
  insertLogEntry: jest.fn(),
}));

const mockTickets = [{ ticket_id: 1, category: 'Technical Support', status: 'Open', priority: 'High', description: 'Issue with product', user_id: 1 }];
const mockUsers = [{ user_id: 1, email: 'user1@example.com' }];

describe('SupportTickets', () => {
  beforeEach(() => {
    fetchSupportTickets.mockResolvedValue(mockTickets);
    fetchUsers.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays tickets and users correctly', async () => {
    render(<SupportTickets />);

    await waitFor(() => {
      expect(screen.getByText('Support Tickets')).toBeInTheDocument();
    });

    expect(screen.getByText('Technical Support')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  test('handles editing ticket correctly', async () => {
    render(<SupportTickets />);

    await waitFor(() => {
      expect(screen.getByText('Technical Support')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));

    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Updated issue' } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(updateSupportTicket).toHaveBeenCalledWith(1, {
        category: 'Technical Support',
        status: 'Open',
        priority: 'High',
        description: 'Updated issue',
        user_id: 1,
      });
    });

    expect(screen.getByText('Updated issue')).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    fetchSupportTickets.mockRejectedValueOnce(new Error('Failed to fetch tickets'));

    render(<SupportTickets />);

    await waitFor(() => {
      expect(screen.getByText('Error: could not fetch data')).toBeInTheDocument();
    });
  });
});