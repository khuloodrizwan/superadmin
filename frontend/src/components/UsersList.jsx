import { useTranslation } from 'react-i18next';

const UsersList = ({ users, onEdit, onDelete, onAssignRole }) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>{t('users.name')}</th>
            <th>{t('users.email')}</th>
            <th>{t('users.role')}</th>
            <th>{t('users.status')}</th>
            <th>{t('users.createdAt')}</th>
            <th>{t('users.lastLogin')}</th>
            <th>{t('users.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                {t('common.noResults')}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? t('users.active') : t('users.inactive')}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{formatDate(user.lastLogin)}</td>
                <td className="actions-cell">
                  <button
                    onClick={() => onEdit(user)}
                    className="btn-icon btn-edit"
                    title={t('common.edit')}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onAssignRole(user)}
                    className="btn-icon btn-role"
                    title={t('users.assignRole')}
                  >
                    👤
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="btn-icon btn-delete"
                    title={t('common.delete')}
                    disabled={user.role === 'superadmin'}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;