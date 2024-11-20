// src/components/RewardsOversight/RewardsOversight.jsx
import React, { useEffect, useState } from 'react';
import { fetchOffers, updateOffer, deleteOffer, fetchRewards, addReward, fetchRedemptions, addRedemption, fetchUsers } from '../../services/supabaseService';
import './RewardsOversight.css';

const RewardsOversight = () => {
  const [offers, setOffers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReward, setNewReward] = useState({ reward_description: '', points: 0, is_active: true });

  useEffect(() => {
    const getData = async () => {
      try {
        const offersData = await fetchOffers();
        setOffers(offersData);
        const rewardsData = await fetchRewards();
        setRewards(rewardsData);
        const redemptionsData = await fetchRedemptions();
        setRedemptions(redemptionsData);
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        setError("could not fetch data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleApproveOffer = async (offer) => {
    try {
      await updateOffer(offer.offer_id, { status: 'Approved' });
      setOffers(offers.map(o => o.offer_id === offer.offer_id ? { ...o, status: 'Approved' } : o));
      await addRedemption({
        user_id: offer.user_id,
        reward_id: offer.reward_id,
        redeemed_date: new Date(),
        redeem_id: offer.offer_id,
        is_reward_redemption: true,
        points_redeemed: offer.awardable_points,
        is_active: true
      });
    } catch (err) {
      setError("could not approve offer");
      console.log(err);
    }
  };

  const handleDenyOffer = async (offerId) => {
    try {
      await deleteOffer(offerId);
      setOffers(offers.filter(o => o.offer_id !== offerId));
    } catch (err) {
      setError("could not deny offer");
      console.log(err);
    }
  };

  const handleAddReward = async () => {
    try {
      const addedReward = await addReward(newReward);
      setRewards([...rewards, ...addedReward]);
      setNewReward({ reward_description: '', points: 0, is_active: true });
    } catch (err) {
      setError("could not add reward");
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
    <div className="rewards-oversight">
      <h2>Rewards Oversight</h2>
      <div className="table-container">
        <h3>Offers</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Offer Name</th>
              <th>Offer Description</th>
              <th>Points</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.offer_id}>
                <td>{getUserEmail(offer.user_id)}</td>
                <td>{offer.offer_name}</td>
                <td>{offer.offer_description}</td>
                <td>{offer.awardable_points}</td>
                <td>{offer.status}</td>
                <td>{new Date(offer.requested_at).toLocaleString()}</td>
                <td className="actions">
                  {offer.status === 'Pending' && (
                    <>
                      <button onClick={() => handleApproveOffer(offer)}>Approve</button>
                      <button className="deny" onClick={() => handleDenyOffer(offer.offer_id)}>Deny</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-container">
        <h3>Rewards Catalog</h3>
        <div className="add-form">
          <h3>Add New Reward</h3>
          <textarea
            value={newReward.reward_description}
            onChange={(e) => setNewReward({ ...newReward, reward_description: e.target.value })}
            placeholder="Description"
          />
          <input
            type="number"
            value={newReward.points}
            onChange={(e) => setNewReward({ ...newReward, points: e.target.value })}
            placeholder="Points Required"
          />
          <button onClick={handleAddReward}>Add Reward</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Points Required</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map(reward => (
              <tr key={reward.reward_id}>
                <td>{reward.reward_description}</td>
                <td>{reward.points}</td>
                <td>{new Date(reward.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-container">
        <h3>Redemptions</h3>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Reward</th>
              <th>Redeemed At</th>
            </tr>
          </thead>
          <tbody>
            {redemptions.map(redemption => (
              <tr key={redemption.redemption_id}>
                <td>{getUserEmail(redemption.user_id)}</td>
                <td>{rewards.find(r => r.reward_id === redemption.reward_id)?.reward_description || 'Unknown Reward'}</td>
                <td>{new Date(redemption.redeemed_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardsOversight;