import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import AuditLogsList from '../components/AuditLogsList';
import api from '../api/axios';

const AuditLogs = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: '',
    startDate: '',
    endDate: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const actions = [
    'user_created',
    'user_updated',
    'user_deleted',
    'role_assigned',
    'login_success',
    'login_failed'
  ];

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/audit-logs?${params.toString()}`);
      if (response.data.success) {
        setLogs(response.data.data.logs);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || t('auditLogs.fetchError')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    setLoading(true);
    fetchLogs();
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      startDate: '',
      endDate: ''
    });
    setLoading(true);
    setTimeout(() => fetchLogs(), 100);
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>{t('auditLogs.title')}</h1>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="action">{t('auditLogs.filterByAction')}</label>
              <select
                id="action"
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Actions</option>
                {actions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="startDate">{t('auditLogs.startDate')}</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="endDate">{t('auditLogs.endDate')}</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={applyFilters} className="btn btn-primary">
              {t('auditLogs.applyFilters')}
            </button>
            <button onClick={clearFilters} className="btn btn-secondary">
              {t('auditLogs.clearFilters')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : (
          <AuditLogsList logs={logs} />
        )}
      </div>
    </div>
  );
};

export default AuditLogs;