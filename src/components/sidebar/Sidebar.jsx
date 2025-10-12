import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Palette,
  MenuIcon,
  Trophy,
  X,
  UsersRound,
  Dumbbell,
  LayoutDashboard,
  Aperture,
  Settings,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import ChevronBreadCrumb from '../bread-crumbs/chevron-bread-crumbs';
import GymLogo from '../../assets/logo.png';
import {
  capitalizeFirstLetter,
  decodeJWT,
  handelLogout,
} from '../../utils/utils';

let navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard, current: true },
  { name: 'Tiers', to: '/tiers', icon: Trophy, current: false },
  { name: 'Users', to: '/users', icon: UsersRound, current: false },
  { name: 'Trainers', to: '/trainers', icon: Dumbbell, current: false },
];

const customization = [
  { name: 'Themes', to: '/themes', icon: Palette, current: false },
];

const tools = [
  {
    name: 'B&A Editor',
    to: '/editor',
    icon: Aperture,
    current: false,
  },
  {
    name: 'Settings',
    to: '/settings',
    icon: Settings,
    current: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ Outlet }) {
  const redirect = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = decodeJWT();

  useEffect(() => {
    if (user?.role === 'trainer') {
      navigation = [
        { name: 'Dashboard', to: '/', icon: LayoutDashboard, current: true },
        { name: 'Users', to: '/users', icon: UsersRound, current: false },
      ];
    }
  }, [user])

  const handleClick = (item) => {
    if (item.to === "/") {
      redirect("/", { replace: true });
    }
  };

  return (
    <div>
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div
          className={`fixed inset-0 z-30 bg-gray-900/80 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 w-full max-w-xs bg-white z-30 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          <div className="relative flex flex-col w-full h-full">
            <div className="absolute top-0 right-0 pt-5 pr-5">
              <button
                type="button"
                className="text-gray-700"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 mt-10">
              <div className="flex h-30 mt-2 items-center">
                <img
                  className="h-24 w-24 md:h-24 md:w-24"
                  src={GymLogo}
                  alt="Glory Gym"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col">
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400 mt-4">
                      Management
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.to}
                            className={({ isActive }) => {
                              return classNames(
                                isActive
                                  ? 'bg-gray-50 text-primary'
                                  : 'text-gray-700 navlink hover:bg-gray-50',
                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold items-center',
                              );
                            }}
                            onClick={() => {
                              handleClick(item)
                              setSidebarOpen(false)
                            }}
                          >
                            <item.icon
                              aria-hidden="true"
                              color="#666666"
                              strokeWidth={1.5}
                            />
                            {item.name}{' '}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {user?.role === 'admin' && (
                    <>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-gray-400 mt-4">
                          Customization
                        </div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {customization.map((item) => (
                            <li key={item.name}>
                              <NavLink
                                to={item.to}
                                className={({ isActive }) => {
                                  return classNames(
                                    isActive
                                      ? 'bg-gray-50 text-primary'
                                      : 'text-gray-700 navlink hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold items-center',
                                  );
                                }}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  color="#666666"
                                  strokeWidth={1.5}
                                />
                                {item.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </>
                  )}
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400 mt-4">
                      Tools
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {tools.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.to}
                            className={({ isActive }) => {
                              return classNames(
                                isActive
                                  ? 'bg-gray-50 text-primary'
                                  : 'text-gray-700 navlink hover:bg-gray-50',
                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold items-center',
                              );
                            }}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <item.icon
                              aria-hidden="true"
                              color="#666666"
                              strokeWidth={1.5}
                            />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <Profile />
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col fixed inset-y-0 z-30 mt-10">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-30 mt-2 items-center">
            <img
              className="h-12 w-12 md:h-24 md:w-24"
              src={GymLogo}
              alt="Glory Gym"
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col">
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 mb-4">
                  Management
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        onClick={() => handleClick(item)}
                        className={({ isActive }) => {
                          return classNames(
                            isActive
                              ? 'bg-gray-50 text-primary'
                              : 'text-gray-700 navlink hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold items-center',
                          );
                        }}
                      >
                        <item.icon
                          aria-hidden="true"
                          color="#666666"
                          strokeWidth={1.5}
                        />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              {user?.role === 'admin' && (
                <>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400 mt-4">
                      Customization
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {customization.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.to}
                            className={({ isActive }) => {
                              return classNames(
                                isActive
                                  ? 'bg-gray-50 text-primary'
                                  : 'text-gray-700 navlink hover:bg-gray-50',
                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                              );
                            }}
                          >
                            <item.icon
                              aria-hidden="true"
                              color="#666666"
                              strokeWidth={1.5}
                            />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                </>
              )}
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400 mt-4">
                  Tools
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {tools.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) => {
                          return classNames(
                            isActive
                              ? 'bg-gray-50 text-primary'
                              : 'text-gray-700 navlink hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm font-semibold items-center',
                          );
                        }}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          aria-hidden="true"
                          color="#666666"
                          strokeWidth={1.5}
                        />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
              <Profile />
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <main>
          <div className="flex justify-between items-center border-b-2 p-4">
            <h2
              className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 cursor-pointer"
              onClick={() => redirect('/')}
            >
              Nexus
              <span className="p-1 text-center font-bold gradient-text">
                Gym
              </span>
            </h2>
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <ChevronBreadCrumb />
        </main>
        <div className="p-4 px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const Profile = () => {
  const user = decodeJWT();
  const redirect = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="relative w-full flex flex-col justify-end h-full">
      {/* Profile Button */}
      <div
        className="flex items-center justify-between gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 w-full cursor-pointer"
        onClick={() => setShowLogout((prev) => !prev)}
      >
        <span aria-hidden="true">
          {user?.role === "admin"
            ? "Master Admin"
            : `${capitalizeFirstLetter(user?.first_name)} ${capitalizeFirstLetter(user?.last_name)}`}
        </span>
        <img
          className="h-8 w-8 rounded-full bg-gray-50"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Profile"
        />
      </div>

      {/* Logout Popup */}
      {showLogout && (
        <div className="absolute bottom-14 left-6 bg-white shadow-md border rounded-md p-2 w-32 text-center z-50">
          <button
            onClick={() => {
              handelLogout();
              redirect("/auth/login")
            }}
            className="w-full px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded"
          >
            Logout
          </button>
        </div>
      )
      }
    </div >
  );
};

Sidebar.propTypes = {
  Outlet: PropTypes.elementType.isRequired,
};
