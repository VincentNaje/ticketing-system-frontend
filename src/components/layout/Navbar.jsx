import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
  `text-sm hover:underline ${isActive ? 'font-semibold underline' : ''}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header
      className="shadow-md flex flex-wrap items-center gap-4 px-6 py-3 text-white"
      style={{ backgroundColor: '#011787' }}
    >
      <Link to="/" className="font-bold tracking-tight">
        BUCENG Ticketing
      </Link>
      <nav className="flex flex-wrap items-center gap-4">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/submit" className={linkClass}>
          Submit concern
        </NavLink>
        <NavLink to="/track" className={linkClass}>
          Track ticket
        </NavLink>
        {user && (
          <NavLink to="/staff" className={linkClass}>
            Staff desk
          </NavLink>
        )}
        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <NavLink to="/admin" className={linkClass}>
            Admin
          </NavLink>
        )}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <span className="text-xs text-blue-100 truncate max-w-[10rem]">
              {user.full_name || user.email}
            </span>
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.assign('/');
              }}
              className="text-xs text-red-300 hover:text-white"
            >
              Log out
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Staff login
          </NavLink>
        )}
      </div>
    </header>
  );
}
