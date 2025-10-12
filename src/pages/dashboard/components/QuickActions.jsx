import {
  AlarmClockCheck,
  CreditCardIcon,
  IndianRupee,
  Search,
} from 'lucide-react';
import Charts from './Charts';
import Reminders from './Reminders';

const QuickActions = ({
  setAddMembershipDrawer,
  setAddPaymentsDrawer,
  setAddReminderDrawer,
  setSearchModel,
  yearOptions,
  graphData,
  chartOptions,
  setSelectedYear,
  selectedYear,
  reminderData,
}) => {
  return (
    <section className="flex flex-col sm:flex-row gap-4">
      <section className='sm:w-1/3'>
        <div className="hidden sm:block">
          <Actions
            setAddMembershipDrawer={setAddMembershipDrawer}
            setAddPaymentsDrawer={setAddPaymentsDrawer}
            setAddReminderDrawer={setAddReminderDrawer}
            setSearchModel={setSearchModel}
          />
        </div>
        <Reminders reminderData={reminderData} />
      </section>
      <section className='sm:w-2/3'>
        <Charts
          yearOptions={yearOptions}
          graphData={graphData}
          chartOptions={chartOptions}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
        />
      </section>
    </section>
  );
};

export const Actions = ({
  setAddMembershipDrawer,
  setAddPaymentsDrawer,
  setAddReminderDrawer,
  setSearchModel,
}) => {
  return (
    <div className="sm:w-full p-6 bg-white rounded-lg border mt-6">
      <div className="flex xl:flex-row xl:items-center justify-between flex-col">
        <h3 className="text-xl font-semibold line-clamp-1">Quick Actions</h3>
        <div className="flex items-center gap-4 -ml-2 my-2 xl:ml-0 xl:my-0">
          <div className="relative group">
            <button
              className="p-2 bg-transparent border-none hover:bg-gray-100 rounded-full transition duration-200"
              onClick={() => setSearchModel(true)}
            >
              <Search className="w-5 h-5 text-gray-500" />
            </button>
            <div className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded-lg p-2 bottom-full mb-2">
              Search
            </div>
          </div>
          <div className="relative group">
            <button
              className="p-2 bg-transparent border-none hover:bg-gray-100 rounded-full transition duration-200"
              onClick={() => setAddMembershipDrawer(true)}
            >
              <CreditCardIcon className="w-5 h-5 text-gray-500" />
            </button>
            <div className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded-lg p-2 bottom-full mb-2">
              Membership
            </div>
          </div>
          <div className="relative group">
            <button
              className="p-2 bg-transparent border-none hover:bg-gray-100 rounded-full transition duration-200"
              onClick={() => setAddPaymentsDrawer(true)}
            >
              <IndianRupee className="w-5 h-5 text-gray-500" />
            </button>
            <div className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded-lg p-2 bottom-full mb-2">
              Payment
            </div>
          </div>
          <div className="relative group">
            <button
              className="p-2 bg-transparent border-none hover:bg-gray-100 rounded-full transition duration-200"
              onClick={() => setAddReminderDrawer(true)}
            >
              <AlarmClockCheck className="w-5 h-5 text-gray-500" />
            </button>
            <div className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded-lg p-2 bottom-full mb-2">
              Reminder
            </div>
          </div>
        </div>
      </div>
      <div className="sm:mt-4 text-gray-500">
        Add search, add users, memberships, reminders,and payments to your
        account.
      </div>
    </div>
  );
};

export default QuickActions;
