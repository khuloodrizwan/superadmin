import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard">{t('app.title')}</Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            {t('nav.dashboard')}
          </Link>
          <Link to="/users" className="nav-link">
            {t('nav.users')}
          </Link>
          <Link to="/audit-logs" className="nav-link">
            {t('nav.auditLogs')}
          </Link>
          <Link to="/analytics" className="nav-link">
            {t('nav.analytics')}
          </Link>
        </div>

        <div className="navbar-actions">
          <LanguageSwitcher />
          {user && (
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;