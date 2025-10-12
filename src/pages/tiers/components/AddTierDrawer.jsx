import { useEffect, useState } from 'react';
import Drawer from '../../../components/ui/drawer/Drawer';
import { toast } from 'react-toastify';
import { updateTiers } from '../../../http/put/putAPIs';
import { createNewTier } from '../../../http/post/postAPIs';
import { safeReload } from '../../../connect-to-db/renderer';
import { queryClient } from '../../../App';

const AddTierDrawer = ({ open, setOpen, isEdit = false, clearEditData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [monthly, setMonthly] = useState('');
  const [quarterly, setQuarterly] = useState('');
  const [halfYearly, setHalfYearly] = useState('');
  const [yearly, setYearly] = useState('');

  useEffect(() => {
    if (isEdit) {
      setName(isEdit.name);
      setDescription(isEdit.description);
      setMonthly(isEdit.monthly);
      setQuarterly(isEdit.quarterly);
      setHalfYearly(isEdit.halfyearly);
      setYearly(isEdit.yearly);
    }
  }, [isEdit]);

  const resetData = () => {
    setName('');
    setDescription('');
    setMonthly('');
    setQuarterly('');
    setHalfYearly('');
    setYearly('');
  };

  const onSubmit = () => {
    const tierData = {
      name,
      description,
      monthly: parseFloat(monthly),
      quarterly: parseFloat(quarterly),
      halfyearly: parseFloat(halfYearly),
      yearly: parseFloat(yearly),
    };

    if (isEdit) {
      updateTiers({
        id: isEdit.tier_id,
        ...tierData,
      }).then(() => {
        queryClient.invalidateQueries(['tiers']);
        resetData();
        setOpen(false);
        //safeReload();
      });
      return;
    }

    if (name && description && monthly && quarterly && halfYearly && yearly) {
      createNewTier(tierData).then((message) => {
        if (message.message) {
          queryClient.invalidateQueries(['tiers']);
          resetData();
          setOpen(false);
          //safeReload();
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
        clearEditData();
      }}
      invalidate="tiers"
      onSave={onSubmit}
      title={isEdit ? 'Update Tier' : 'Create New Tier'}
    >
      <div className="p-4">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 px-3 py-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter tier name"
          />
        </div>
        <div className="mb-4">
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
            placeholder="Enter tier description"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="monthly"
            className="block text-sm font-medium text-gray-700"
          >
            Monthly Price
          </label>
          <input
            type="number"
            id="monthly"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="mt-1 px-3 py-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter monthly price"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="quarterly"
            className="block text-sm font-medium text-gray-700"
          >
            Quarterly Price
          </label>
          <input
            type="number"
            id="quarterly"
            value={quarterly}
            onChange={(e) => setQuarterly(e.target.value)}
            className="mt-1 px-3 py-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter quarterly price"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="halfYearly"
            className="block text-sm font-medium text-gray-700"
          >
            Half-Yearly Price
          </label>
          <input
            type="number"
            id="halfYearly"
            value={halfYearly}
            onChange={(e) => setHalfYearly(e.target.value)}
            className="mt-1 px-3 py-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter half-yearly price"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="yearly"
            className="block text-sm font-medium text-gray-700"
          >
            Yearly Price
          </label>
          <input
            type="number"
            id="yearly"
            value={yearly}
            onChange={(e) => setYearly(e.target.value)}
            className="mt-1 px-3 py-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter yearly price"
          />
        </div>
      </div>
    </Drawer>
  );
};

export default AddTierDrawer;
