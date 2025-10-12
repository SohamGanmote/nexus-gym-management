import { useNavigate, useParams } from 'react-router-dom';
import {
  getUsersPaymentById,
  getUsersSubscriptionById,
} from '../../../http/get/getAPIs';
import { useQuery } from '@tanstack/react-query';
import Table from '../../../components/table/Table';
import { useState } from 'react';
import { capitalizeFirstLetter, formatDate } from '../../../utils/utils';
import Chip from '../../../components/ui/chip/Chip';
import { ArrowLeft, History, ReceiptIndianRupee } from 'lucide-react';

const UserDetails = () => {
  const redirect = useNavigate();

  const { user_id, subscription_id } = useParams();

  const [page, setPage] = useState(1);

  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ['users-subscription', page],
    queryFn: () => getUsersSubscriptionById({ user_id }),
  });

  const {
    data: paymentsData,
    error: paymentsError,
    isLoading: paymentsisLoading,
  } = useQuery({
    queryKey: ['users-payments', page, subscription_id],
    queryFn: () => getUsersPaymentById({ user_id, subscription_id }),
    enabled: !!isSuccess
  });

  if (!isLoading && data) {
    data.header = subscription_id
      ? ['ID', 'paid', 'payable', 'mode', 'added by', 'date']
      : [
        'ID',
        'Tier',
        'Start Date',
        'End Date',
        'paid',
        'payable',
        'mode',
        'membership',
        'added by',
        'action',
      ];

    data.data = subscription_id
      ? paymentsData?.payments.map((item) => {
        return {
          payment_id: item.payment_id,
          paid: '₹' + item.paid,
          payable: '₹' + item.payable,
          mode: capitalizeFirstLetter(item.mode),
          added_by: `${capitalizeFirstLetter(
            item.admin_first_name,
          )} ${capitalizeFirstLetter(item.admin_last_name)}`,
          date: formatDate(item.date.split('T')[0]),
        };
      })
      : data.subscriptions?.map((item) => {
        return {
          subscription_id: item.subscription_id,
          tier: () => (
            <p className="font-bold">
              {capitalizeFirstLetter(item.tier?.name)}
            </p>
          ),
          start_date: formatDate(item.start_date?.split('T')[0]),
          end_date: formatDate(item.end_date.split('T')[0]),
          paid: `₹${item.payment?.paid}`,
          payable: `₹${item.payment?.payable}`,
          mode: capitalizeFirstLetter(item.payment.mode),
          membership: () => (
            <>{item.isActive ? <Chip isActive={true} /> : <Chip />}</>
          ),
          added_by: `${capitalizeFirstLetter(
            item.admin_first_name,
          )} ${capitalizeFirstLetter(item.admin_last_name)}`,
          action: () => (
            <div className="flex items-center gap-4" >
              <div className="relative group">
                <button
                  className="p-1 bg-transparent border-none hover:bg-gray-100 rounded-full transition duration-200"
                  onClick={() =>
                    redirect(`/users/${user_id}/${item.subscription_id}`)
                  }
                >
                  <History className="w-5 h-5 text-gray-500" />
                </button>
                <div className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded-lg p-1.5 bottom-full right-1 mb-2">
                  Payment History
                </div>
              </div>
              <div className="relative group">
                <button
                  className="p-1 bg-transparent border-none hover:bg-gray-100 rounded-full transition duration-200"
                  onClick={() => redirect(`/invoice/${item.subscription_id}`)}
                >
                  <ReceiptIndianRupee className="w-5 h-5 text-gray-500" />
                </button>
                <div className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded-lg p-1.5 bottom-full mb-2 ">
                  Invoice
                </div>
              </div>
            </div>
          ),
        };
      });
  }

  return (
    <>
      <div className="p-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                See User Details
              </h1>
              <span
                className="cursor-pointer mb-2 bg-slate-100 p-2 rounded-full w-fit border sm:hidden"
                onClick={() => {
                  redirect('/users');
                }}
              >
                <ArrowLeft className="text-gray-500" size={18} />
              </span>
              <button
                className="cursor-pointer mb-2 bg-slate-100 text-sm p-2 rounded-md px-4 w-fit border hidden sm:block"
                onClick={() => {
                  redirect('/users');
                }}
              >
                Back
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              Access comprehensive details about each member in your gym. This
              includes their full name, date of birth, payment history,
              subscription plans, and other relevant information. Utilize this
              section to manage memberships and monitor user activity
              efficiently.
            </p>
          </div>
        </div>

        {!isLoading && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <div className="space-y-1">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                placeholder="John"
                disabled
                value={capitalizeFirstLetter(data.user.first_name)}
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
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
                placeholder="Doe"
                disabled
                value={capitalizeFirstLetter(data.user.last_name)}
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                value={data.user?.dob?.split('T')[0] || 'Not Found!'}
                disabled
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                type="tel"
                value={`+91 ${data.user.mobile_no}`}
                disabled
                placeholder="+1 (123) 456-7890"
                className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        )}

        <h1 className="mt-6 flex justify-between items-center">
          <span className="text-base font-semibold leading-6 text-gray-900">
            {' '}
            {subscription_id ? 'Payments History' : 'Membership History'}
          </span>
        </h1>

        <Table
          tableData={data}
          noDataTitle="No Membership Found"
          onPageChange={(e) => {
            setPage(e);
          }}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};
export default UserDetails;
