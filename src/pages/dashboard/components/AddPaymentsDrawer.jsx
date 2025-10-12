import { useEffect, useState } from 'react';
import Drawer from '../../../components/ui/drawer/Drawer';
import { CreditCardIcon, IndianRupee } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  getUsersSubscriptionWithPendingPaymentsById,
} from '../../../http/get/getAPIs';
import {
  capitalizeFirstLetter,
  formatDate,
  getTodayDate,
} from '../../../utils/utils';
import SearchDropdown from '../../../components/search-dropdown/SearchDropdown';
import { createNewPayment } from '../../../http/post/postAPIs';
import { toast } from 'react-toastify';

const AddPaymentsDrawer = ({ open, setOpen, userData, setUserSearch }) => {
  const [clientName, setClientName] = useState(null);
  const [subscriptionName, setSubscriptionName] = useState(null);
  const [paid, setPaid] = useState(0);
  const [payable, setPayable] = useState(0);
  const [date, setDate] = useState(getTodayDate());
  const [paymentMode, setPaymentMode] = useState('cash');

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

  const { data: subscriptionData } = useQuery({
    queryKey: ['get-subscription-data', clientName],
    queryFn: () =>
      getUsersSubscriptionWithPendingPaymentsById({
        user_id: clientName.user_id,
      }),
  });

  let subscriptionOptions = [{ value: 'loading', label: 'Select User First' }];
  if (subscriptionData === undefined) {
    subscriptionOptions = [
      { value: 'loading', label: 'No subscription found' },
    ];
  }
  if (subscriptionData?.subscriptions.length > 0) {
    subscriptionOptions = subscriptionData.subscriptions.map((item) => {
      return {
        ...item,
        value: item.subscription_id,
        label: capitalizeFirstLetter(item.tier.name),
      };
    });

    subscriptionOptions = subscriptionOptions.filter(
      (item) => item.payment.payable !== 0,
    );
  }

  const paymentModes = [
    { name: 'Cash', value: 'cash', icon: IndianRupee },
    { name: 'Online', value: 'online', icon: CreditCardIcon },
  ];

  const resetStates = () => {
    setUserSearch('a');
    setClientName(null);
    setSubscriptionName(null);
    setPaid(0);
    setPayable(0);
    setDate(getTodayDate());
    setPaymentMode('cash');
  };

  const handlePaidChange = (e) => {
    const paidAmount = parseFloat(e.target.value) || 0;
    setPaid(paidAmount);
  };

  const onSubmit = () => {
    createNewPayment({
      mode: paymentMode,
      paid,
      payable,
      date,
      subscription_id: subscriptionName.subscription_id,
      user_id: clientName.user_id,
    }).then((res) => {
      if (res.message) {
        resetStates();
        setOpen(false);
      }
    });
  };

  useEffect(() => {
    if (paid <= subscriptionName?.payment?.payable) {
      setPayable(subscriptionName?.payment?.payable - paid);
    }
    if (paid > subscriptionName?.payment?.payable) {
      setPaid(subscriptionName?.payment?.payable);
      setPayable(0);
    }
  }, [subscriptionName, paid]);

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      resetData={resetStates}
      invalidate="'get-statistics-data','users-payable'"
      onSave={onSubmit}
      title="Add New Payment"
    >
      <div className="p-4">
        <div className="space-y-4">
          <SearchDropdown
            additionalClassName="space-y-1"
            id="clientName"
            label="Client Name"
            value={clientName}
            onChange={setClientName}
            onInputChange={(e) => setUserSearch(e)}
            options={clientOptions}
            placeholder="Select Client"
            isDisabled={subscriptionName ? true : false}
            isClearable
          />

          <SearchDropdown
            additionalClassName="space-y-1"
            id="subscriptionName"
            label="Subscription"
            value={subscriptionName}
            onChange={setSubscriptionName}
            options={subscriptionOptions}
            placeholder="Select Subscription"
            isClearable
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="paid"
                className="block text-sm font-medium text-gray-700"
              >
                Paid
              </label>
              <input
                id="paid"
                value={paid}
                onChange={handlePaidChange}
                placeholder="0"
                type="number"
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none"
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  appearance: 'textfield',
                }}
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="payable"
                className="block text-sm font-medium text-gray-700"
              >
                Payable
              </label>
              <input
                id="payable"
                value={payable}
                disabled
                placeholder="0"
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none "
                style={{
                  border: 'none',
                  appearance: 'textfield',
                }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Date
            </label>
            <input
              id="startDate"
              type="date"
              value={date}
              max={getTodayDate()}
              onChange={(e) => setDate(e.target.value)}
              className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none"
            />
            {date && (
              <p className="text-sm text-gray-500 mt-2">{formatDate(date)}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Payment Mode
            </label>
            <div className="flex items-center gap-3 mt-4 pt-2">
              {paymentModes.map((mode) => (
                <label
                  key={mode.value}
                  className={`flex cursor-pointer rounded-md px-3 py-2 pr-5 text-sm w-fit border focus:outline-none text-gray-500 ${paymentMode === mode.value ? 'gradient-div text-white' : ''
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    value={mode.value}
                    checked={paymentMode === mode.value}
                    onChange={() => setPaymentMode(mode.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <mode.icon className="w-5 h-5 mr-2" />
                      <span className="font-medium">{mode.name}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default AddPaymentsDrawer;
