import { useTranslation } from 'react-i18next';

const AuditLogsList = ({ logs }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeClass = (action) => {
    const actionMap = {
      'user_created': 'success',
      'user_updated': 'info',
      'user_deleted': 'danger',
      'role_assigned': 'primary',
      'login_success': 'success',
      'login_failed': 'danger'
    };
    return actionMap[action] || 'default';
  };

  return (
    <div className="audit-logs-container">
      <table className="audit-logs-table">
        <thead>
          <tr>
            <th>{t('auditLogs.action')}</th>
            <th>{t('auditLogs.actor')}</th>
            <th>{t('auditLogs.target')}</th>
            <th>{t('auditLogs.timestamp')}</th>
            <th>{t('auditLogs.details')}</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                {t('auditLogs.noLogs')}
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log._id}>
                <td>
                  <span className={`action-badge action-${getActionBadgeClass(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td>{log.actor?.email || 'System'}</td>
                <td>{log.target?.email || 'N/A'}</td>
                <td>{formatDate(log.createdAt)}</td>
                <td className="details-cell">
                  {log.details ? (
                    <pre className="details-json">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogsList;