import { useEffect, useState } from 'react';
import Drawer from '../../../components/ui/drawer/Drawer';
import { createNewUser } from '../../../http/post/postAPIs';
import { toast } from 'react-toastify';
import { updateUser } from '../../../http/put/putAPIs';
import { queryClient } from '../../../App';
import { capitalizeFirstLetter, formatDate } from '../../../utils/utils';
import { safeReload } from '../../../connect-to-db/renderer';

const AddUserDrawer = ({ open, setOpen, isEdit = false, clearEditData, refetch }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    if (isEdit) {
      const dob = isEdit.dob
        ? new Date(isEdit.dob).toISOString().split('T')[0]
        : '';
      setFirstName(isEdit.first_name);
      setLastName(isEdit.last_name);
      setDateOfBirth(dob);
      setMobileNumber(isEdit.mobile_no);
    }
    // eslint-disable-next-line
  }, [isEdit]);

  const resetData = () => {
    setFirstName('');
    setLastName('');
    setDateOfBirth('');
    setMobileNumber('');
  };

  const onSubmit = () => {
    if (isEdit) {
      updateUser({
        user_id: isEdit.user_id,
        first_name: firstName,
        last_name: lastName,
        mobile_no: mobileNumber,
        dob: dateOfBirth,
      }).then(() => {
        queryClient.invalidateQueries(['users']);
        //safeReload();
      });
      resetData();
      setOpen(false);
      return;
    }
    if (firstName && lastName && mobileNumber) {
      createNewUser({
        first_name: firstName,
        last_name: lastName,
        mobile_no: mobileNumber,
        dob: dateOfBirth,
      }).then((message) => {
        if (message.message) {
          queryClient.invalidateQueries(['users']);
          resetData();
          setOpen(false);
        }
      });
    } else {
      toast.warning('Please fill out both fields');
    }
  };

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      resetData={() => {
        resetData();
        if (clearEditData) {
          clearEditData();
        }
      }}
      invalidate="users"
      onSave={onSubmit}
      title={isEdit ? 'Update User' : 'Create New User'}
    >
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="space-y-1 mt-4">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
        </div>
        <div className="space-y-1 mt-4">
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile Number
          </label>
          <input
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
              if (value.length <= 10) {
                setMobileNumber(value); // Update state if valid
              } else {
                toast.error('Mobile number cannot exceed 10 digits.');
              }
            }}
            placeholder="+91 1234567890"
            className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {isEdit && isEdit.Subscriptions && isEdit.Subscriptions.length > 0 && (
        <>
          <h1 className="text-base font-semibold leading-6 text-gray-900 mt-6 mb-10">
            Active Memberships
          </h1>
          {isEdit.Subscriptions.map((item) => {
            return (
              <>
                <div className="w-full mt-4 max-w-[22.9rem] bg-white border rounded-lg overflow-hidden mx-auto">
                  <div className="bg-primary text-white px-4 py-3 rounded-t-md border">
                    <h2 className="text-base font-semibold">
                      {capitalizeFirstLetter(item.Tier.name)}
                    </h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Start Date
                      </div>
                      <div className="text-xs font-medium">
                        {formatDate(item.start_date.split('T')[0])}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        End Date
                      </div>
                      <div className="text-xs font-medium">
                        {formatDate(item.end_date.split('T')[0])}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 my-3"></div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Paid Amount
                      </div>
                      <div className="text-xs font-medium">
                        ₹
                        {item.Payments.reduce(
                          (sum, payment) => sum + payment.paid,
                          0,
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Payable Amount
                      </div>
                      <div className="text-xs font-medium">
                        ₹
                        {
                          item.Payments.reduce((latest, payment) => {
                            return new Date(payment.date) >
                              new Date(latest.date)
                              ? payment
                              : latest;
                          }, item.Payments[0]).payable
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </>
      )}
    </Drawer>
  );
};

export default AddUserDrawer;
