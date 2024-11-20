// src/components/ContentManagement/ContentManagement.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentManagement from './ContentManagement';
import { fetchContent, fetchEvents, fetchEventRegistrations, fetchUsers } from '../../services/supabaseService';

// Mock the fetch functions
jest.mock('../../services/supabaseService', () => ({
  fetchContent: jest.fn(),
  fetchEvents: jest.fn(),
  fetchEventRegistrations: jest.fn(),
  fetchUsers: jest.fn(),
}));

const mockContent = [{ content_id: 1, title: 'Content 1', content_type: 'Article', content: 'Content body', category: 'Category 1', created_by: 1, created_at: '2023-01-01T00:00:00Z' }];
const mockEvents = [{ event_id: 1, event_name: 'Event 1', description: 'Event description', event_date: '2023-01-01T00:00:00Z', created_by: 1, created_at: '2023-01-01T00:00:00Z' }];
const mockRegistrations = [{ registration_id: 1, user_id: 1, event_id: 1, registration_date: '2023-01-01T00:00:00Z' }];
const mockUsers = [{ user_id: 1, email: 'user1@example.com' }];

describe('ContentManagement', () => {
  beforeEach(() => {
    fetchContent.mockResolvedValue(mockContent);
    fetchEvents.mockResolvedValue(mockEvents);
    fetchEventRegistrations.mockResolvedValue(mockRegistrations);
    fetchUsers.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ContentManagement component and displays elements', async () => {
    render(<ContentManagement />);

    await waitFor(() => {
      expect(screen.getByText('Content Management')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Add New Content').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Add New Event').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Educational Resources').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Events').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Event Registrations').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Content 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Event 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('user1@example.com').length).toBeGreaterThan(0);
  });
});