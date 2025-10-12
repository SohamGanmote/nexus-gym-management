import Table from '../../components/table/Table';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getReceivables } from '../../http/get/getAPIs';
import { capitalizeFirstLetter, formatDate } from '../../utils/utils';
import useDebounce from '../../hooks/useDebounce';
import { ArrowLeft, Eye, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddPaymentsDrawer from '../dashboard/components/AddPaymentsDrawer';

export default function Receivables() {
  const redirect = useNavigate();

  const [page, setPage] = useState(1);

  const [searchValue, setSearchValue] = useState('');

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const [paymentDrawer, setPaymentDrawer] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['users-payable', page, debouncedSearchValue],
    queryFn: () => getReceivables({ page, search: searchValue }),
  });

  if (!isLoading && data) {
    data.header = [
      'ID',
      'Name',
      'Mobile No',
      'Tier',
      'End Date',
      'Payable',
      'Action',
    ];

    data.data = data.data.map((item) => {
      return {
        subscription_id: item.subscription_id,
        name: () => (
          <p className="font-bold">
            {capitalizeFirstLetter(item?.first_name)}{' '}
            {capitalizeFirstLetter(item?.last_name)}
          </p>
        ),
        mobile_no: `+91 ${item?.mobile_no}`,
        tier: capitalizeFirstLetter(item.Subscription?.Tier?.name),
        end_date: formatDate(item?.Subscription?.end_date),
        payable: () => {
          if (new Date(item?.Subscription?.end_date) < new Date()) {
            return (
              <p className="text-red-500">Overdue Payment ₹{item?.payable}</p>
            );
          } else {
            return <p>₹{item?.payable}</p>;
          }
        },
        action: () => (
          <div className="flex items-center gap-4">
            <Eye
              size={20}
              className="hover:text-black cursor-pointer"
              onClick={() => redirect(`/users/${item.user_id}`)}
            />
            <IndianRupee
              size={20}
              className="hover:text-black cursor-pointer"
              onClick={() => setPaymentDrawer(true)}
            />
          </div>
        ),
      };
    });
  }

  return (
    <>
      <div className="p-0">
        <div className="sm:flex sm:items-center">
          <p
            className="cursor-pointer mb-2 bg-slate-100 p-2 rounded-full w-fit border sm:hidden"
            onClick={() => {
              redirect(-1);
            }}
          >
            <ArrowLeft className="text-gray-500" size={18} />
          </p>
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Users with Receivables
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users which have not paid yet, including their
              name, title, email and role.
            </p>
          </div>
          <button
            className="cursor-pointer mb-2 bg-slate-100 text-sm p-2 rounded-md px-4 w-fit border hidden sm:block"
            onClick={() => {
              redirect(-1);
            }}
          >
            Back
          </button>
        </div>

        <Table
          tableData={data}
          onPageChange={(e) => {
            setPage(e);
          }}
          isLoading={isLoading}
          filterComponent={
            <TableFilters
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          }
        />
      </div>

      <AddPaymentsDrawer open={paymentDrawer} setOpen={setPaymentDrawer} />
    </>
  );
}

const TableFilters = ({ searchValue, setSearchValue }) => {
  return (
    <div className="flex items-center mb-4 space-x-4">
      <div className="sm:w-1/5 w-1/2">
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder="Search"
        />
      </div>
    </div>
  );
};
