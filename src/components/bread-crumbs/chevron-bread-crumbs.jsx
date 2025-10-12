import { ChevronRightIcon, LayoutDashboard } from 'lucide-react';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function ChevronBreadCrumb() {
  const location = useLocation();
  let currentLink = '';

  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currentLink += `/${crumb}`;

      const capitalizeCrumb =
        crumb.charAt(0).toUpperCase() + crumb.slice(1).toLowerCase();

      return (
        <React.Fragment key={Math.random()}>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <NavLink
                to={currentLink}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={capitalizeCrumb ? 'page' : undefined}
              >
                {capitalizeCrumb}
              </NavLink>
            </div>
          </li>
        </React.Fragment>
      );
    });

  return (
    <nav
      className="md:flex bg-white p-6 py-5 pb-0 hidden"
      aria-label="Breadcrumb"
    >
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <NavLink
              to="/"
              className="text-gray-400 hover:text-gray-500 flex items-center"
            >
              <LayoutDashboard
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <span className="ml-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Dashboard
              </span>
            </NavLink>
          </div>
        </li>
        {crumbs}
      </ol>
    </nav>
  );
}
