import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import api from '../api/axios';

const Analytics = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || t('analytics.fetchError')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>{t('analytics.title')}</h1>
          <button onClick={fetchAnalytics} className="btn btn-secondary">
            🔄 Refresh
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : (
          <AnalyticsDashboard data={data} />
        )}
      </div>
    </div>
  );
};

export default Analytics;