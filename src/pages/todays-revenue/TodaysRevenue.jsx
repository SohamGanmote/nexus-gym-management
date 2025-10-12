import { useState } from 'react';
import { getTodaysRevenue } from '../../http/get/getAPIs';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ReceiptIndianRupee } from 'lucide-react';
import { capitalizeFirstLetter, formatDate } from '../../utils/utils';
import Table from '../../components/table/Table';

const TodaysRevenue = () => {
  const redirect = useNavigate();

  // Initialize the date to today's date by default
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch data using the selected date
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['todays-revenue', date], // Include date as part of the query key to refetch on date change
    queryFn: () => getTodaysRevenue({ date }),
  });

  let totalIncome = 0; // Initialize totalIncome variable

  if (!isLoading && data) {
    data.header = [
      'ID',
      'Name',
      'Mobile No',
      'Tier',
      'Start Date',
      'End Date',
      'Paid Amount',
      'Invoice',
    ];
    data.data = data.data.map((item) => {
      // Add the paid amount to totalIncome
      totalIncome += item?.paid || 0;

      return {
        name: () => (
          <p className="font-bold">
            {capitalizeFirstLetter(item?.first_name)}{' '}
            {capitalizeFirstLetter(item?.last_name)}
          </p>
        ),
        mobile_no: `+91 ${item?.mobile_no}`,
        tier: capitalizeFirstLetter(item.tier_name),
        start_date: formatDate(item?.start_date),
        end_date: formatDate(item?.end_date),
        paid: () => <p>₹{item?.paid}</p>,
        invoice: () => (
          <ReceiptIndianRupee
            size={20}
            className="hover:text-black cursor-pointer"
            onClick={() =>
              redirect(`/invoice/${item?.subscription_id}`)
            }
          />
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
              redirect('/');
            }}
          >
            <ArrowLeft className="text-gray-500" size={18} />
          </p>
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Details of {`Today's`} Payments
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the payments made today, including user information,
              payment mode, and amounts.
            </p>
          </div>

          <button
            className="cursor-pointer mb-2 bg-slate-100 text-sm p-2 rounded-md px-4 w-fit border hidden sm:block"
            onClick={() => {
              redirect('/');
            }}
          >
            Back
          </button>
        </div>

        {/* Calendar input to select the date */}
        <div className="my-4 flex items-center">
          <label className="font-medium text-gray-700">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value); // Update date state on date change
            }}
            className="mt-1 px-2 py-1 ml-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Display Total Income */}
        <div className="mt-4 p-2 sm:p-4 bg-gray-100 rounded-md shadow-sm sm:flex items-center">
          <h3 className="sm:text-lg font-semibold text-gray-900">
            Total Income for Today ({formatDate(date)})
          </h3>
          <p className="text-lg mt-1 sm:mt-0 sm:text-xl font-bold text-green-600 ml-2">
            ₹{totalIncome}
          </p>
        </div>

        {/* Table component */}
        <Table
          tableData={data}
          onPageChange={(e) => {
            setPage(e);
          }}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default TodaysRevenue;
