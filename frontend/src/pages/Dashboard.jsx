import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="dashboard-welcome">
          <h1>{t('app.welcome')}, {user?.name}!</h1>
          <p className="welcome-message">
            You are logged in as <strong>{user?.role}</strong>
          </p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>👥 {t('nav.users')}</h3>
            <p>Manage system users, create new accounts, and assign roles.</p>
          </div>

          <div className="dashboard-card">
            <h3>📋 {t('nav.auditLogs')}</h3>
            <p>View detailed audit logs of all system activities.</p>
          </div>

          <div className="dashboard-card">
            <h3>📊 {t('nav.analytics')}</h3>
            <p>Monitor system metrics and user activity statistics.</p>
          </div>
        </div>

        <div className="quick-stats">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">
              ➕ {t('users.addUser')}
            </button>
            <button className="action-btn">
              👁️ {t('auditLogs.title')}
            </button>
            <button className="action-btn">
              📈 {t('analytics.title')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;