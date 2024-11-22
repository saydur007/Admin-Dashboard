import React, { useEffect, useState } from "react";
import "./Cards.css";
import { fetchUsers, fetchSupportTickets, fetchContent, fetchRewards, fetchFeedback } from "../../services/supabaseService";
import Card from "../Card/Card";

const Cards = () => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [rewardsData, setRewardsData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
        const ticketsData = await fetchSupportTickets();
        setTickets(ticketsData);
        const content = await fetchContent();
        setContentData(content);
        const rewards = await fetchRewards();
        setRewardsData(rewards);
        const feedback = await fetchFeedback();
        setFeedbackData(feedback);
      } catch (err) {
        setError("could not fetch data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const cardsData = [
    {
      title: "Active Users",
      value: users.length,
      color: { backGround: "linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)", boxShadow: "0px 10px 20px 0px #1e3a8a" },
      barValue: ((users.filter(user => user.status === "Active").length / users.length) * 100).toFixed(2),
      png: "UilUsersAlt",
      series: [{ name: "Users", data: users.map(user => user.created_at) }],
    },
    {
      title: "Open Tickets",
      value: tickets.filter(ticket => ticket.status === "Open").length,
      color: { backGround: "linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)", boxShadow: "0px 10px 20px 0px #3b82f6" },
      barValue: ((tickets.filter(ticket => ticket.status === "Open").length / tickets.length) * 100).toFixed(2),
      png: "UilClipboardAlt",
      series: [{ name: "Tickets", data: tickets.map(ticket => ticket.created_at) }],
    },
    {
      title: "Total Content",
      value: contentData.length,
      color: { backGround: "linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)", boxShadow: "0px 10px 20px 0px #1e3a8a" },
      barValue: (contentData.length / contentData.length) * 100,
      png: "UilPackage",
      series: [{ name: "Content", data: contentData.map(content => content.created_at) }],
    },
    {
      title: "Active Rewards",
      value: rewardsData.length,
      color: { backGround: "linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)", boxShadow: "0px 10px 20px 0px #3b82f6" },
      barValue: ((rewardsData.filter(reward => reward.is_active).length / rewardsData.length) * 100).toFixed(2),
      png: "UilUsdSquare",
      series: [{ name: "Rewards", data: rewardsData.map(reward => reward.earned_date) }],
    },
    {
      title: "5 star Feedback",
      value: feedbackData.filter(feedback => feedback.rating === 5).length,
      color: { backGround: "linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)", boxShadow: "0px 10px 20px 0px #1e3a8a" },
      barValue: ((feedbackData.filter(feedback => feedback.rating === 5).length / feedbackData.length) * 100).toFixed(2),
      png: "UilChart",
      series: [{ name: "Feedback", data: feedbackData.map(feedback => feedback.submitted_at) }],
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="Cards">
      {cardsData.map((card, id) => (
        <div className="parentContainer" key={id}>
          <Card
            title={card.title}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            png={card.png}
            series={card.series}
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;