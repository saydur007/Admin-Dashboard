import supabase from '../config/supabaseClient';

// Fetch all users
export const fetchUsers = async () => {
  const { data, error } = await supabase.from('01_users').select();
  if (error) {
    throw new Error(error.message, 'Error fetching users');
  }
  return data;
};

export const updateUser = async (userId, updates) => {
    const { data, error } = await supabase.from('01_users').update(updates).eq('user_id', userId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Delete a user
  export const deleteUser = async (userId) => {
    const { data, error } = await supabase.from('01_users').delete().eq('user_id', userId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  // Fetch all user profiles
export const fetchUserProfiles = async () => {
    const { data, error } = await supabase.from('02_user_profile').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  export const updateUserProfile = async (userId, updates) => {
    const { data, error } = await supabase.from('02_user_profile').update(updates).eq('user_id', userId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  // Delete a user profile
export const deleteUserProfile = async (userId) => {
  const { data, error } = await supabase.from('02_user_profile').delete().eq('user_id', userId);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
  
  // Fetch all activity logs
  export const fetchActivityLogs = async () => {
    const { data, error } = await supabase.from('03_activity_log').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all rewards
  export const fetchRewards = async () => {
    const { data, error } = await supabase.from('04_rewards').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  // Add reward
export const addReward = async (newReward) => {
    const { data, error } = await supabase.from('04_rewards').insert(newReward);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all support tickets
  export const fetchSupportTickets = async () => {
    const { data, error } = await supabase.from('05_support_ticket').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  export const updateSupportTicket = async (userId, updates) => {
    const { data, error } = await supabase.from('05_support_ticket').update(updates).eq('ticket_id', userId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Delete a user
  export const deleteSupportTicket = async (userId) => {
    const { data, error } = await supabase.from('05_support_ticket').delete().eq('ticket_id', userId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all notifications
  export const fetchNotifications = async () => {
    const { data, error } = await supabase.from('06_notifications').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all feedback
  export const fetchFeedback = async () => {
    const { data, error } = await supabase.from('07_feedback').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all content
  export const fetchContent = async () => {
    const { data, error } = await supabase.from('08_content').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  // Add content
export const addContent = async (newContent) => {
    const { data, error } = await supabase.from('08_content').insert(newContent);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  
// Update content
export const updateContent = async (contentId, updates) => {
    const { data, error } = await supabase.from('08_content').update(updates).eq('content_id', contentId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Delete content
  export const deleteContent = async (contentId) => {
    const { data, error } = await supabase.from('08_content').delete().eq('content_id', contentId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  // Update feedback
export const updateFeedback = async (feedbackId, updates) => {
    const { data, error } = await supabase.from('07_feedback').update(updates).eq('feedback_id', feedbackId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all events
  export const fetchEvents = async () => {
    const { data, error } = await supabase.from('09_events').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

// Add event
export const addEvent = async (newEvent) => {
    const { data, error } = await supabase.from('09_events').insert(newEvent);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  
// Update event
export const updateEvent = async (eventId, updates) => {
    const { data, error } = await supabase.from('09_events').update(updates).eq('event_id', eventId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Delete event
  export const deleteEvent = async (eventId) => {
    const { data, error } = await supabase.from('09_events').delete().eq('event_id', eventId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all event registrations
  export const fetchEventRegistrations = async () => {
    const { data, error } = await supabase.from('10_event_registration').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  // Add event registration
export const addEventRegistration = async (newRegistration) => {
    const { data, error } = await supabase.from('10_event_registrations').insert(newRegistration);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all admin management logs
  export const fetchAdminManagementLogs = async () => {
    const { data, error } = await supabase.from('11_admin_management').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all reports
  export const fetchReports = async () => {
    const { data, error } = await supabase.from('12_reports').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all offers
  export const fetchOffers = async () => {
    const { data, error } = await supabase.from('Offer').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Update offer
export const updateOffer = async (offerId, updates) => {
    const { data, error } = await supabase.from('Offer').update(updates).eq('offer_id', offerId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  
// Delete offer
export const deleteOffer = async (offerId) => {
    const { data, error } = await supabase.from('offers').delete().eq('offer_id', offerId);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  

  // Fetch all redemptions
  export const fetchRedemptions = async () => {
    const { data, error } = await supabase.from('Redemptions').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  // Add redemption
export const addRedemption = async (newRedemption) => {
    const { data, error } = await supabase.from('Redemptions').insert(newRedemption);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  
  // Fetch all support tickets (duplicate function for clarity)
  export const fetchSupportTicketsDuplicate = async () => {
    const { data, error } = await supabase.from('support_ticket').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  export const insertLogEntry = async (adminId, actionType, description) => {
    const { data, error } = await supabase.from('11_admin_management').insert([
      {
        admin_id: adminId,
        action_type: actionType,
        description: description,
        action_date: new Date(),
      },
    ]);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };