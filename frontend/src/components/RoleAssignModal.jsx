import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const RoleAssignModal = ({ user, roles, onAssign, onClose }) => {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(user?.role || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole && selectedRole !== user.role) {
      onAssign(user._id, selectedRole);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('roleAssign.title')}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="user-info-box">
            <p><strong>{t('users.name')}:</strong> {user?.name}</p>
            <p><strong>{t('users.email')}:</strong> {user?.email}</p>
            <p><strong>{t('roleAssign.currentRole')}:</strong> 
              <span className={`role-badge role-${user?.role}`}>
                {user?.role}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="newRole">{t('roleAssign.newRole')}</label>
              <select
                id="newRole"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="form-control"
              >
                <option value="">{t('roleAssign.selectRole')}</option>
                {roles.map((role) => (
                  <option key={role.name} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedRole || selectedRole === user?.role}
              >
                {t('roleAssign.assign')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                {t('roleAssign.cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignModal;