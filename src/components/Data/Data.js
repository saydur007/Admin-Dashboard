// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
} from "@iconscout/react-unicons";


// Sidebar Data
// Data.js

// Sidebar Data
export const SidebarData = [
  { icon: UilEstate, heading: "Dashboard" },
  { icon: UilClipboardAlt, heading: "User Management" },
  { icon: UilUsersAlt, heading: "Support Tickets" },
  { icon: UilPackage, heading: "Content Management" },
  { icon: UilChart, heading: "Rewards Oversight" },
  { icon: UilChart, heading: "Feedback Review" },
];

// Sample Data for Users
export const usersData = [
  {
    user_id: 1,
    email: "admin@example.com",
    role: "Admin",
    status: "Active",
    email_verified: true,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  // Add more users
];

// Sample Data for Support Tickets
export const ticketsData = [
  {
    ticket_id: 1,
    user_id: 1,
    category: "Technical Support",
    status: "Open",
    priority: "High",
    description: "Issue with logging in",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  // Add more tickets
];

// Sample Data for Content
export const contentData = [
  {
    content_id: 1,
    title: "How to use the portal",
    content_type: "Article",
    content: "This is a guide on how to use the portal.",
    category: "Tutorial",
    created_by: 1,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  // Add more content
];

// Sample Data for Rewards
export const rewardsData = [
  {
    reward_id: 1,
    user_id: 1,
    points_earned: 100,
    points_redeemed: 50,
    reward_description: "First purchase",
    is_active: true,
    earned_date: "2023-01-01T00:00:00Z",
    redeemed_date: "2023-01-01T00:00:00Z",
  },
  // Add more rewards
];

// Sample Data for Feedback
export const feedbackData = [
  {
    feedback_id: 1,
    user_id: 1,
    rating: 5,
    comments: "Great service!",
    is_anonymous: false,
    submitted_at: "2023-01-01T00:00:00Z",
  },
  // Add more feedback
];
