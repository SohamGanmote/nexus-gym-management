import { useEffect, useState } from 'react';
import Drawer from '../../../components/ui/drawer/Drawer';
import { CreditCardIcon, IndianRupee } from 'lucide-react';
import { RadioGroup } from '@headlessui/react';
import {
  capitalizeFirstLetter,
  formatDate,
  getTodayDate,
} from '../../../utils/utils';
import SearchDropdown from '../../../components/search-dropdown/SearchDropdown';
import { createNewSubscription } from '../../../http/post/postAPIs';
import { toast } from 'react-toastify';
import { queryClient } from '../../../App';

const frequencies = [
  { value: 'monthly', label: '1 M', priceSuffix: '/month', months: 1 },
  { value: 'quarterly', label: '3 M', priceSuffix: '/quarter', months: 3 },
  { value: 'halfyearly', label: '6 M', priceSuffix: '/half-year', months: 6 },
  { value: 'yearly', label: '1 Y', priceSuffix: '/year', months: 12 },
  { value: 'custom', label: 'Custom', priceSuffix: '/month' },
];

const AddMembershipDrawer = ({ open, setOpen, userData, tiersData, setUserSearch }) => {
  const start = new Date();
  const end = new Date();
  end.setMonth(start.getMonth() + 3);

  const [clientName, setClientName] = useState(null);
  const [tier, setTier] = useState(null);
  const [paymentMode, setPaymentMode] = useState('cash'); // Default to "cash"
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState('');

  // states
  const [paid, setPaid] = useState(0);
  const [months, setMonths] = useState(7);
  const [discount, setDiscount] = useState(0);
  const [duration, setDuration] = useState(frequencies[1]);

  const [totalPrice, setTotalPrice] = useState(0);

  const tierOptions = tiersData
    ? tiersData.map((item) => {
      return { ...item, label: capitalizeFirstLetter(item.label) };
    })
    : [{ value: 'loading', label: 'loading' }];

  let clientOptions = [{ value: 'loading', label: 'loading' }];
  if (Array.isArray(userData) && userData?.length > 0)
    clientOptions = userData.map((item) => {
      return {
        ...item,
        value: item.user_id,
        label: `${capitalizeFirstLetter(
          item.first_name,
        )} ${capitalizeFirstLetter(item.last_name)}`,
      };
    });

  const paymentModes = [
    { name: 'Cash', value: 'cash', icon: IndianRupee },
    { name: 'Online', value: 'online', icon: CreditCardIcon },
  ];

  const handelTierSelect = (e) => {
    setTier(e);
  };

  const handelDurationChange = (newDuration) => {
    setDuration(newDuration);
  };

  const handlePaidChange = (e) => {
    const paidAmount = parseFloat(e.target.value) || 0;

    // Ensure that the paid amount is not greater than the original plan amount
    if (paidAmount <= totalPrice && paidAmount >= 0) {
      setPaid(paidAmount);
    } else {
      setPaid(totalPrice); // If paid exceeds original plan, set paid to full amount
    }
  };

  const handleDiscountChange = (e) => {
    const discountAmount = parseFloat(e.target.value) || 0;

    // Ensure that the discount is not greater than the original plan amount
    if (discountAmount <= totalPrice) {
      setDiscount(discountAmount);
    }
  };

  const handelMonthChange = (e) => {
    if (e.target.value > 0 && tier) {
      setMonths(e.target.value);
    }
  };

  const getPayableAmount = () => {
    if (!tier) return 0;

    // 1 month
    if (duration.value === 'monthly') {
      if (discount > tier.tier_data.monthly - paid) {
        setDiscount(tier.tier_data.monthly - paid);
        setPaid(0);
      }
      if (paid > tier.tier_data.monthly - discount) {
        setPaid(tier.tier_data.monthly);
        setDiscount(0);
      }
      return tier.tier_data.monthly - paid - discount;
    }

    // 3 months
    if (duration.value === 'quarterly') {
      if (discount > tier.tier_data.quarterly - paid) {
        setDiscount(tier.tier_data.quarterly - paid);
        setPaid(0);
      }
      if (paid > tier.tier_data.quarterly - discount) {
        setPaid(tier.tier_data.quarterly);
        setDiscount(0);
      }
      return tier.tier_data.quarterly - paid - discount;
    }

    // 6 months
    if (duration.value === 'halfyearly') {
      if (discount > tier.tier_data.halfyearly - paid) {
        setDiscount(tier.tier_data.halfyearly - paid);
        setPaid(0);
      }
      if (paid > tier.tier_data.halfyearly - discount) {
        setPaid(tier.tier_data.halfyearly);
        setDiscount(0);
      }
      return tier.tier_data.halfyearly - paid - discount;
    }

    // 12 months
    if (duration.value === 'yearly') {
      if (discount > tier.tier_data.yearly - paid) {
        setDiscount(tier.tier_data.yearly - paid);
        setPaid(0);
      }
      if (paid > tier.tier_data.yearly - discount) {
        setPaid(tier.tier_data.yearly);
        setDiscount(0);
      }
      return tier.tier_data.yearly - paid - discount;
    }

    // custom range
    if (duration.value === 'custom') {
      if (discount > tier.tier_data.monthly * months - paid) {
        setDiscount(tier.tier_data.monthly * months - paid);
        setPaid(0);
      }
      if (paid > tier.tier_data.monthly * months - discount) {
        setPaid(tier.tier_data.monthly * months);
        setDiscount(0);
      }
      return tier.tier_data.monthly * months - paid - discount;
    }
    return 0;
  };

  const calculateEndDate = (start, months) => {
    const startDt = new Date(start);
    const endDt = new Date(startDt);
    endDt.setMonth(startDt.getMonth() + parseInt(months));
    return endDt.toISOString().split('T')[0]; // format date as YYYY-MM-DD
  };

  const resetStates = () => {
    setClientName(null);
    setTier(null);
    setPaymentMode('cash'); // Reset to default 'cash'
    setStartDate(getTodayDate());
    setPaid(0);
    setMonths(7); // Reset to the initial value you specified (7 months)
    setDiscount(0);
    setDuration(frequencies[1]); // Reset to default frequency (in this case, frequencies[1])
    setTotalPrice(0); // Reset total price to 0
    setUserSearch('');
  };

  const onSubmit = () => {
    createNewSubscription({
      user_id: clientName.user_id,
      tier_id: tier.value,
      start_date: startDate,
      end_date: endDate,
      mode: paymentMode,
      paid: paid,
      payable: getPayableAmount(),
    }).then((res) => {
      if (res.message) {
        resetStates();
        setOpen(false);
      }
    });
  };

  useEffect(() => {
    if (duration.value === 'custom')
      setEndDate(calculateEndDate(startDate, months));
    else setEndDate(calculateEndDate(startDate, duration.months));
  }, [startDate, months, duration]);

  useEffect(() => {
    let newPlanAmount = 0;

    // Set original plan amount based on selected tier and duration
    if (duration.value === 'monthly') {
      newPlanAmount = tier?.tier_data.monthly;
    } else if (duration.value === 'quarterly') {
      newPlanAmount = tier?.tier_data.quarterly;
    } else if (duration.value === 'halfyearly') {
      newPlanAmount = tier?.tier_data.halfyearly;
    } else if (duration.value === 'yearly') {
      newPlanAmount = tier?.tier_data.yearly;
    } else {
      newPlanAmount = tier?.tier_data.monthly;
    }

    setTotalPrice(newPlanAmount);
  }, [tier, duration]);

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      resetData={resetStates}
      invalidate="get-statistics-data"
      onSave={onSubmit}
      title="Add New Membership"
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
            isClearable
            reversed={true}
          />

          <SearchDropdown
            additionalClassName="space-y-1"
            id="tier"
            label="Tier"
            value={tier}
            onChange={handelTierSelect}
            options={tierOptions}
            placeholder="Select Tier"
            isClearable
          />

          <div className="space-y-1">
            <label
              htmlFor="tier"
              className="block text-sm font-medium text-gray-700"
            >
              Time Period
            </label>

            <div className="mt-16 flex justify-center">
              <RadioGroup
                value={duration}
                onChange={handelDurationChange}
                className="grid grid-cols-5 gap-x-1 rounded-md p-1 text-center text-xs font-semibold leading-5 border w-full"
              >
                {frequencies.map((option) => (
                  <RadioGroup.Option
                    key={option.value}
                    value={option}
                    className={({ checked }) =>
                      classNames(
                        checked ? 'gradient-div text-white' : 'text-gray-500',
                        'cursor-pointer rounded-md px-2.5 py-1',
                      )
                    }
                  >
                    <span className="line-clamp-1">{option.label}</span>
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>
          </div>

          {duration.value === 'custom' && (
            <div className="space-y-1">
              <label
                htmlFor="months"
                className="block text-sm font-medium text-gray-700"
              >
                Duration in Months
              </label>
              <input
                id="months"
                value={months}
                onChange={handelMonthChange}
                placeholder="months"
                type="number"
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none"
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  appearance: 'textfield',
                }}
              />
            </div>
          )}

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
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700"
              >
                Discount
              </label>
              <input
                id="discount"
                value={discount}
                onChange={handleDiscountChange}
                placeholder="Add Discount"
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none"
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  appearance: 'textfield',
                }}
              />
            </div>
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
              value={getPayableAmount()}
              disabled
              placeholder="0"
              className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none "
              style={{
                border: 'none',
                appearance: 'textfield',
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none"
              />
              {startDate && (
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(startDate)}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                disabled
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none"
              />
              {endDate && (
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(endDate)}
                </p>
              )}
            </div>
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
    </Drawer >
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default AddMembershipDrawer;
