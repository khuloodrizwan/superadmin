import { useTranslation } from 'react-i18next';

const AnalyticsDashboard = ({ data }) => {
  const { t } = useTranslation();

  if (!data) {
    return <div className="no-data">{t('analytics.noData')}</div>;
  }

  const { overview, roleDistribution, recentActivities } = data;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="analytics-dashboard">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{t('analytics.totalUsers')}</h3>
            <p className="metric-value">{overview?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>{t('analytics.activeUsers')}</h3>
            <p className="metric-value">{overview?.activeUsers || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">❌</div>
          <div className="metric-content">
            <h3>{t('analytics.inactiveUsers')}</h3>
            <p className="metric-value">{overview?.inactiveUsers || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎭</div>
          <div className="metric-content">
            <h3>{t('analytics.totalRoles')}</h3>
            <p className="metric-value">{overview?.totalRoles || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔑</div>
          <div className="metric-content">
            <h3>{t('analytics.loginsLast7Days')}</h3>
            <p className="metric-value">{overview?.loginsLast7Days || 0}</p>
          </div>
        </div>
      </div>

      <div className="analytics-sections">
        <div className="analytics-section">
          <h3>{t('analytics.roleDistribution')}</h3>
          <div className="role-distribution">
            {roleDistribution && Object.keys(roleDistribution).length > 0 ? (
              Object.entries(roleDistribution).map(([role, count]) => (
                <div key={role} className="role-item">
                  <span className={`role-badge role-${role}`}>{role}</span>
                  <span className="role-count">{count} users</span>
                  <div className="role-bar">
                    <div
                      className="role-bar-fill"
                      style={{
                        width: `${(count / overview?.totalUsers) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">{t('analytics.noData')}</p>
            )}
          </div>
        </div>

        <div className="analytics-section">
          <h3>{t('analytics.recentActivities')}</h3>
          <div className="recent-activities">
            {recentActivities && recentActivities.length > 0 ? (
              <ul className="activity-list">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="activity-item">
                    <div className="activity-header">
                      <span className="activity-action">{activity.action}</span>
                      <span className="activity-time">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                    <div className="activity-details">
                      <span className="activity-actor">{activity.actor}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">{t('analytics.noData')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;