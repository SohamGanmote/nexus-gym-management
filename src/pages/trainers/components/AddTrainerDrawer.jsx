import { useEffect, useState } from 'react';
import Drawer from '../../../components/ui/drawer/Drawer';
import { createNewTrainer } from '../../../http/post/postAPIs';
import { toast } from 'react-toastify';
import { updateTrainer } from '../../../http/put/putAPIs';
import { queryClient } from '../../../App';
import { generatePassword } from '../../../utils/utils';
const AddTrainerDrawer = ({ open, setOpen, isEdit = false, clearEditData }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // New state for username

  useEffect(() => {
    if (isEdit) {
      setFirstName(isEdit.first_name);
      setLastName(isEdit.last_name);
      setMobileNumber(isEdit.mobile_no);
      setPassword(isEdit.password_hash);
      setUsername(isEdit.username); // Set username if editing
    }
    // eslint-disable-next-line
  }, [isEdit]);

  const resetData = () => {
    setFirstName('');
    setLastName('');
    setMobileNumber('');
    setPassword('');
    setUsername(''); // Reset username
  };

  const onSubmit = () => {
    if (isEdit) {
      updateTrainer({
        admin_id: isEdit.admin_id,
        first_name: firstName,
        last_name: lastName,
        mobile_no: mobileNumber,
        username: username,
        password: password,
      }).then(() => {
        queryClient.invalidateQueries(['trainer']);
      });
      resetData();
      setOpen(false);
      return;
    }
    if (firstName && lastName && mobileNumber && username) {
      // Check if username is filled
      createNewTrainer({
        first_name: firstName,
        last_name: lastName,
        mobile_no: mobileNumber,
        password: password,
        username: username, // Include username in creation
      }).then((message) => {
        if (message.message) {
          queryClient.invalidateQueries(['trainer']);
          resetData();
          setOpen(false);
        }
      });
    } else {
      toast.warning('Please fill out all fields');
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
      invalidate="vendors"
      onSave={onSubmit}
      title={isEdit ? 'Update Trainer' : 'Create New Trainer'}
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
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
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
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="+91 1234567890"
            className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
        </div>
        <div className="space-y-1 mt-4">
          <label
            htmlFor="password"
            className="flex text-sm font-medium text-gray-700 justify-between items-center"
          >
            {isEdit ? 'Password Hash' : 'Password'}
            <span
              className="text-sm text-primary ml-2 cursor-pointer"
              onClick={() => setPassword(generatePassword())}
            >
              Generate Password
            </span>
          </label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="$jh342@j4*&34"
            className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </Drawer>
  );
};

export default AddTrainerDrawer;
