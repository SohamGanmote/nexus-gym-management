import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// component imports
import Root from './pages/Root';
import NotFound from './pages/NotFound';
import Login from './pages/login/Login';
import AuthRoot from './pages/AuthRoot';
import Users from './pages/users/Users';
import Theme from './pages/theme/Theme';
import Tiers from './pages/tiers/Tiers';
import UserDetails from './pages/users/components/UserDetails';
import Dashboard from './pages/dashboard/Dashboard';
import { decodeJWT } from './utils/utils';
import Trainers from './pages/trainers/Trainers';
import Invoice from './pages/invoice/Invoice';
import Editor from './pages/editor/Editor';
import Receivables from './pages/receivables/Receivables';
import Settings from './pages/settings/Settings';
import TodaysRevenue from './pages/todays-revenue/TodaysRevenue';
import Reminders from './pages/reminders/Reminders';

const Router = () => {
  const user = decodeJWT();

  let router = createBrowserRouter([
    {
      path: '/auth',
      element: <AuthRoot />,
      errorElement: <NotFound />,
      children: [{ path: 'login', element: <Login /> }],
    },
    {
      path: '/',
      element: <Root />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'tiers', element: <Tiers /> },
        { path: 'themes', element: <Theme /> },
        { path: 'users', element: <Users /> },
        { path: 'users/:user_id', element: <UserDetails /> },
        { path: 'users/:user_id/:subscription_id', element: <UserDetails /> },
        { path: 'trainers', element: <Trainers /> },
        { path: 'editor', element: <Editor /> },
        { path: 'receivables', element: <Receivables /> },
        { path: 'settings', element: <Settings /> },
        { path: 'todays-revenue', element: <TodaysRevenue /> },
        { path: 'reminders', element: <Reminders /> },
      ],
    },
    {
      path: '/invoice/:subscription_id',
      children: [{ index: true, element: <Invoice /> }],
    },
  ]);

  if (user?.role === 'trainer') {
    router = createBrowserRouter([
      {
        path: '/auth',
        element: <AuthRoot />,
        errorElement: <NotFound />,
        children: [{ path: 'login', element: <Login /> }],
      },
      {
        path: '/',
        element: <Root />,
        errorElement: <NotFound />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'users', element: <Users /> },
          { path: 'users/:user_id', element: <UserDetails /> },
          { path: 'users/:user_id/:subscription_id', element: <UserDetails /> },
          { path: 'editor', element: <Editor /> },
          { path: 'settings', element: <Settings /> },
          { path: 'receivables', element: <Receivables /> },
          { path: 'reminders', element: <Reminders /> },
        ],
      },
      {
        path: '/invoice/:invoice_id',
        children: [{ index: true, element: <Invoice /> }],
      },
    ]);
  }

  return <RouterProvider router={router} />;
};

export default Router;
