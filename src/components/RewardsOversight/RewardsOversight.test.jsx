// src/components/RewardsOversight/RewardsOversight.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RewardsOversight from './RewardsOversight';
import { fetchOffers, deleteOffer, fetchRewards, addReward, fetchRedemptions, addRedemption, fetchUsers, insertLogEntry } from '../../services/supabaseService';

// Mock the fetch functions
jest.mock('../../services/supabaseService', () => ({
  fetchOffers: jest.fn(),
  deleteOffer: jest.fn(),
  fetchRewards: jest.fn(),
  addReward: jest.fn(),
  fetchRedemptions: jest.fn(),
  addRedemption: jest.fn(),
  fetchUsers: jest.fn(),
  insertLogEntry: jest.fn(),
}));

const mockOffers = [{ offer_id: 1, user_id: 1, offer_name: 'Offer 1', offer_description: 'Description 1', awardable_points: 100, reward_id: 1 }];
const mockRewards = [{ reward_id: 1, reward_description: 'Reward 1', points: 100 }];
const mockRedemptions = [{ redemption_id: 1, user_id: 1, reward_id: 1, redeemed_date: '2023-01-01T00:00:00Z' }];
const mockUsers = [{ user_id: 1, email: 'user1@example.com' }];

describe('RewardsOversight', () => {
  beforeEach(() => {
    fetchOffers.mockResolvedValue(mockOffers);
    fetchRewards.mockResolvedValue(mockRewards);
    fetchRedemptions.mockResolvedValue(mockRedemptions);
    fetchUsers.mockResolvedValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays data correctly', async () => {
    render(<RewardsOversight />);

    await waitFor(() => {
      expect(screen.getByText('Rewards Oversight')).toBeInTheDocument();
    });

    expect(screen.getByText('Offer 1')).toBeInTheDocument();

  });

  test('handles approving offer correctly', async () => {
    render(<RewardsOversight />);

    await waitFor(() => {
      expect(screen.getByText('Offer 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Approve'));

    await waitFor(() => {
      expect(addRedemption).toHaveBeenCalledWith({
        user_id: 1,
        reward_id: 1,
        redeemed_date: expect.any(String),
        redeem_id: 1,
        is_reward_redemption: true,
        points_redeemed: 100,
        is_active: true,
      });
      expect(deleteOffer).toHaveBeenCalledWith(1);
      expect(insertLogEntry).toHaveBeenCalledWith(1, 'Approve Offer', 'Approved offer 1 for user 1');
    });

    expect(screen.queryByText('Offer 1')).not.toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    fetchOffers.mockRejectedValueOnce(new Error('Failed to fetch offers'));

    render(<RewardsOversight />);

    await waitFor(() => {
      expect(screen.getByText('Error: could not fetch data')).toBeInTheDocument();
    });
  });
});