import './App.css';
import MainDash from './components/MainDash/MainDash';
import RightSide from './components/RigtSide/RightSide';
import Sidebar from './components/Sidebar';
import UserManagement from './components/UserManagement/UserManagement';
import SupportTickets from './components/TicketManagement/SupportTickets';
import FeedbackReview from './components/FeedbackReview/FeedbackReview';
import ContentManagement from './components/ContentManagement/ContentManagement';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="AppGlass" style={{ height: '100vh', overflowY: 'auto' }}>
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainDash />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/supporttickets" element={<SupportTickets />} />
            <Route path="/feedbackreview" element={<FeedbackReview />} />
            <Route path="/contentmanagement" element={<ContentManagement />} />
          </Routes>
          <RightSide />
        </div>
      </Router>
    </div>
  );
}

export default App;