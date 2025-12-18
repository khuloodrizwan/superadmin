import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const UserForm = ({ user, roles, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user',
        isActive: user.isActive !== undefined ? user.isActive : true
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('userForm.nameRequired');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('userForm.emailRequired');
    }
    if (!user && !formData.password.trim()) {
      newErrors.password = t('userForm.passwordRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      if (user && !submitData.password) {
        delete submitData.password;
      }
      onSubmit(submitData);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="name">{t('userForm.name')}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('userForm.namePlaceholder')}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">{t('userForm.email')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('userForm.emailPlaceholder')}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">
          {t('userForm.password')} {user && '(Leave blank to keep current)'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={t('userForm.passwordPlaceholder')}
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="role">{t('userForm.role')}</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          {roles.map(role => (
            <option key={role.name} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          {t('userForm.isActive')}
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {t('userForm.submit')}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          {t('userForm.cancel')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;