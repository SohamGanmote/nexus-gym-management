import { useState } from 'react';
import Toggle from '../../components/ui/toggle/Toggle';
import { capitalizeFirstLetter, decodeJWT } from '../../utils/utils';

const Settings = () => {
  const token = decodeJWT();

  const [enabled, setEnabled] = useState(() => {
    const hide = localStorage.getItem('hideDetails');
    if (hide === 'true') return true;
    else return false;
  });

  const handelUpdate = (e) => {
    setEnabled(e);
    localStorage.setItem('hideDetails', e);
  };

  return (
    <>
      {/* User Information Section */}
      <div className="bg-white rounded-lg">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          User Information
        </h1>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <div className="space-y-1">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              value={capitalizeFirstLetter(token.first_name)}
              disabled
              placeholder="John"
              className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              value={capitalizeFirstLetter(token.last_name)}
              disabled
              placeholder="Doe"
              className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <input
              id="role"
              value={capitalizeFirstLetter(token.role)}
              disabled
              readOnly
              className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900  ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      {/* Hide Dashboard Details Toggle */}
      {token?.role === 'admin' &&
        <div className="mt-6 bg-white rounded-lg ">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Dashboard Settings
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Toggle the visibility of dashboard details. This setting allows you to
            hide certain sensitive information on your dashboard for a cleaner and
            more focused view.
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              Hide Dashboard Details
            </span>
            <Toggle enabled={enabled} setEnabled={handelUpdate} />
          </div>
        </div>
      }
    </>
  );
};

export default Settings;
