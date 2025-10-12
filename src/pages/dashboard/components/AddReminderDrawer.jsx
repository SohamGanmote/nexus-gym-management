import { useState } from 'react';
import Drawer from '../../../components/ui/drawer/Drawer';
import {
  capitalizeFirstLetter,
  formatDate,
  getTodayDate,
} from '../../../utils/utils';
import SearchDropdown from '../../../components/search-dropdown/SearchDropdown';
import { toast } from 'react-toastify';
import { createNewReminder } from '../../../http/post/postAPIs';

const AddReminderDrawer = ({ open, setOpen, userData, setUserSearch }) => {
  const [clientName, setClientName] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [reminderType, setReminderType] = useState('');

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

  const resetStates = () => {
    setUserSearch('a');
    setClientName(null);
    setDate(getTodayDate());
    setReminderType(''); // Reset Reminder Type
  };

  const onSubmit = () => {
    // Handle the submission logic
    if (!clientName || !reminderType) {
      toast.error('Please select both Client Name and Reminder Type');
      return;
    }

    createNewReminder({
      user_id: clientName.user_id,
      description,
      reminder_type: reminderType,
      date_and_time: date,
    }).then((data) => {
      resetStates();
      setOpen(false);
    });
  };

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      resetData={resetStates}
      invalidate="get-statistics-data"
      onSave={onSubmit}
      title="Add New Reminder"
    >
      <div className="p-4">
        <div className="space-y-4">
          {/* Client Name Dropdown */}
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
          />
        </div>

        {/* Reminder Type Dropdown */}
        <div className="space-y-4 mt-4">
          <label
            htmlFor="reminderType"
            className="block text-sm font-medium text-gray-700"
          >
            Reminder Type
          </label>
          <select
            value={reminderType}
            onChange={(e) => setReminderType(e.target.value)}
            className="w-full rounded-md border-0 p-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset text-sm mt-0"
          >
            <option value="">Select Reminder Type</option>
            <option value="payment_due">Payment Due</option>
            <option value="re-visit">Revisit</option>
          </select>
        </div>

        {/* Description Textarea */}
        <div className="my-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 px-3 py-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter reminder description"
            rows="4"
          />
        </div>

        {/* Reminder Date Input */}
        <div className="space-y-1">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Reminder Date
          </label>
          <input
            id="startDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 appearance-none"
          />
          {date && (
            <p className="text-sm text-gray-500 mt-2">{formatDate(date)}</p>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default AddReminderDrawer;
