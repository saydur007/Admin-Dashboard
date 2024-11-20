// src/components/UserManagement/UserManagement.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserManagement from './UserManagement';
import { fetchUsers, fetchUserProfiles, updateUser, updateUserProfile, deleteUser, insertLogEntry } from '../../services/supabaseService';

// Mock the fetch functions
jest.mock('../../services/supabaseService', () => ({
  fetchUsers: jest.fn(),
  fetchUserProfiles: jest.fn(),
  updateUser: jest.fn(),
  updateUserProfile: jest.fn(),
  deleteUser: jest.fn(),
  insertLogEntry: jest.fn(),
}));

const mockUsers = [{ user_id: 1, email: 'user1@example.com', role: 'Admin', status: 'Active' }];
const mockProfiles = [{ user_id: 1, first_name: 'John', last_name: 'Doe', contact_number: '1234567890' }];

describe('UserManagement', () => {
  beforeEach(() => {
    fetchUsers.mockResolvedValue(mockUsers);
    fetchUserProfiles.mockResolvedValue(mockProfiles);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays users and profiles correctly', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  test('handles editing user correctly', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'newemail@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(1, { email: 'newemail@example.com', role: 'Admin' });
      expect(updateUserProfile).toHaveBeenCalledWith(1, { first_name: 'Jane', last_name: 'Doe', contact_number: '1234567890' });
    });

    expect(screen.getByText('newemail@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    fetchUsers.mockRejectedValueOnce(new Error('Failed to fetch users'));

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Error: could not fetch data')).toBeInTheDocument();
    });
  });
});