import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import SearchDropdown from '../../../components/search-dropdown/SearchDropdown';
import { capitalizeFirstLetter } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';
import searchSvg from '../../../assets/search.svg';
import { safeReload } from '../../../connect-to-db/renderer';

const SearchModal = ({ isOpen, setIsOpen, userData, setUserSearch }) => {
  const redirect = useNavigate();
  const [clientName, setClientName] = useState(null);

  const closeModal = () => {
    setIsOpen(false);
    //safeReload();
  };

  let clientOptions = [{ value: 'loading', label: 'loading' }];
  if (userData?.length > 0)
    clientOptions = userData.map((item) => {
      return {
        ...item,
        value: item.user_id,
        label: `${capitalizeFirstLetter(
          item.first_name,
        )} ${capitalizeFirstLetter(item.last_name)}`,
      };
    });

  const handelSelectName = (e) => {
    redirect(`/users/${e.value}`);
    setClientName(e);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* Glass Background */}
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-30 backdrop-blur-sm"
            onClick={closeModal}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          {/* Adjusted Modal Position */}
          <div className="flex items-start justify-center px-4 pt-5 sm:pt-16">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl p-6 bg-white rounded-lg shadow-lg border border-gray-200 h-[21rem]">
                {/* Search Input */}
                <SearchDropdown
                  additionalClassName="space-y-2"
                  id="clientName"
                  label="Search Users"
                  value={clientName}
                  onChange={handelSelectName}
                  onInputChange={(e) => setUserSearch(e)}
                  options={clientOptions}
                  placeholder="Find anything..."
                  isClearable
                />
                <div className="mt-6 text-center space-y-2 text-gray-500">
                  <img
                    src={searchSvg}
                    alt=""
                    className="mx-auto w-2/3 sm:w-1/2"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SearchModal;
