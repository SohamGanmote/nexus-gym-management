import {
  Banknote,
  CalendarIcon,
  CreditCardIcon,
  HandCoins,
  UserCheckIcon,
  UsersIcon,
} from 'lucide-react';
import { decodeJWT } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';

const Statistics = ({ statisticsData }) => {
  const user = decodeJWT();
  const redirect = useNavigate();

  const map = {
    "Today's Revenue": '/todays-revenue',
    // Receivables: '/receivables',
    'General Members': '/users',
  };

  const renderIcon = (title) => {
    switch (title) {
      case "Today's Revenue":
        return <Banknote className="h-5 w-5" />;
      case 'Monthly Revenue':
        return <CreditCardIcon className="h-5 w-5" />;
      case 'Receivables':
        return <HandCoins className="h-5 w-5" />;
      case 'General Members':
        return <UsersIcon className="h-5 w-5" />;
      case 'New Membership':
        return <UserCheckIcon className="h-5 w-5" />;
      case 'New Enquiries':
        return <CalendarIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const hide = localStorage.getItem('hideDetails') || false;

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${user?.role === 'trainer'
        ? 'xl:grid-cols-4'
        : '2xl:grid-cols-6'
        } `}
    >
      {(statisticsData === null || statisticsData === undefined) && (
        <SkeletonLoader />
      )}
      {statisticsData &&
        statisticsData.map((stat, index) => {
          if (
            (user?.role === 'trainer' && index === 0) ||
            (user?.role === 'trainer' && index === 1)
          ) {
            return;
          }
          return (
            <div
              key={index}
              className={`bg-white border rounded-lg overflow-hidden ${map[stat.title] ? 'cursor-pointer' : ''
                } `}
              onClick={() => map[stat.title] && redirect(map[stat.title])}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary sm:bg-white">
                <h3 className="text-sm font-medium text-white sm:text-gray-800">
                  {stat.title}
                </h3>
                <span className="text-white sm:text-gray-600">
                  {renderIcon(stat.title)}
                </span>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {hide === 'true' &&
                    (stat.title === "Today's Revenue" ||
                      stat.title === 'Monthly Revenue')
                    ? '••••'
                    : stat.value}
                </div>
                <p className="text-xs text-gray-600">{stat.percentageChange}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

const SkeletonLoader = () => {
  const user = decodeJWT();
  return (
    <>
      {Array.from({
        length: user?.role === 'trainer' ? 4 : 6,
      }).map((_, index) => (
        <div
          key={index}
          className="bg-white border rounded-lg overflow-hidden animate-pulse"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          </div>
          <div className="p-4">
            <div className="h-8 bg-gray-300 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Statistics;
