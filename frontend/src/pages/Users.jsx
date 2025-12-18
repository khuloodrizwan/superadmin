import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import UsersList from '../components/UsersList';
import UserForm from '../components/UserForm';
import RoleAssignModal from '../components/RoleAssignModal';
import api from '../api/axios';

const Users = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/users?search=${searchTerm}`);
      if (response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      showMessage('error', t('users.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      if (response.data.success) {
        setRoles(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(t('users.confirmDelete'))) {
      try {
        const response = await api.delete(`/users/${user._id}`);
        if (response.data.success) {
          showMessage('success', t('users.deleteSuccess'));
          fetchUsers();
        }
      } catch (error) {
        showMessage('error', error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleAssignRole = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedUser) {
        const response = await api.put(`/users/${selectedUser._id}`, formData);
        if (response.data.success) {
          showMessage('success', t('users.updateSuccess'));
        }
      } else {
        const response = await api.post('/users', formData);
        if (response.data.success) {
          showMessage('success', t('users.createSuccess'));
        }
      }
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Operation failed');
    }
  };

  const handleRoleAssign = async (userId, roleName) => {
    try {
      const response = await api.post('/roles/assign', {
        userId,
        roleName
      });
      if (response.data.success) {
        showMessage('success', t('roleAssign.success'));
        setShowRoleModal(false);
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', t('roleAssign.error'));
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>{t('users.title')}</h1>
          <button onClick={handleAddUser} className="btn btn-primary">
            ➕ {t('users.addUser')}
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="search-box">
          <input
            type="text"
            placeholder={t('users.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading">{t('common.loading')}</div>
        ) : (
          <UsersList
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onAssignRole={handleAssignRole}
          />
        )}

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedUser ? t('users.editUser') : t('users.addUser')}</h2>
                <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
              </div>
              <div className="modal-body">
                <UserForm
                  user={selectedUser}
                  roles={roles}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {showRoleModal && (
          <RoleAssignModal
            user={selectedUser}
            roles={roles}
            onAssign={handleRoleAssign}
            onClose={() => setShowRoleModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Users;