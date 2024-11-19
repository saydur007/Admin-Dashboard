import React, { useEffect, useState } from "react";
import "./Updates.css";
import { fetchAdminManagementLogs, fetchUsers } from "../../services/supabaseService";

const Updates = () => {
  const [updatesData, setUpdatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUpdates = async () => {
      try {
        const logsData = await fetchAdminManagementLogs();
        const usersData = await fetchUsers();

        const updates = logsData
          .map(log => ({
            name: usersData.find(user => user.user_id === log.admin_id)?.email || "Unknown Admin",
            noti: log.action_type,
            description: log.description,
            time: log.action_date,
          }))
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 7); 

        setUpdatesData(updates);
      } catch (err) {
        setError("could not fetch updates");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getUpdates();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="Updates">
      {updatesData.map((update, index) => (
        <div className="update" key={index}>
          <div className="noti">
            <div style={{ marginBottom: '0.5rem' }}>
              <span>{update.name}</span>
              <span> {update.noti}</span>
            </div>
            <span>{update.description}</span>
            <span>{new Date(update.time).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Updates;