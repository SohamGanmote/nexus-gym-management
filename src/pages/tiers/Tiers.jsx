import { useState } from 'react';
import Button from '../../components/ui/button/Button';
import { getTiers } from '../../http/get/getAPIs';
import Table from '../../components/table/Table';
import { useQuery } from '@tanstack/react-query';
import { PencilIcon, Trash2 } from 'lucide-react';
import { deleteTier } from '../../http/delete/deleteAPIs';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { capitalizeFirstLetter } from '../../utils/utils';
import AddTierDrawer from './components/AddTierDrawer';
import { queryClient } from '../../App';

export default function Tiers() {
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['tiers', page],
    queryFn: () => getTiers({ page }),
  });

  if (!isLoading && data) {
    data.header = [
      'ID',
      'Name',
      'Description',
      'Monthly',
      'Quarterly',
      'half-yearly',
      'yearly',
      'Action',
    ];

    data.data = data.data.map((item) => {
      return {
        tier_id: item.tier_id,
        name: () => (
          <p className="font-bold">{capitalizeFirstLetter(item.name)}</p>
        ),
        description: () => (
          <p className="w-96 break-words whitespace-normal line-clamp-2">
            {item.description}
          </p>
        ),
        monthly: () => <p className="font-medium">₹{item.monthly}</p>,
        quarterly: () => <p className="font-medium">₹{item.quarterly}</p>,
        halfyearly: () => <p className="font-medium">₹{item.halfyearly}</p>,
        yearly: () => <p className="font-medium">₹{item.yearly}</p>,
        action: () => {
          const handelDelete = async () => {
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#41B3A2',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
              if (result.isConfirmed) {
                deleteTier(item.tier_id).then((data) => {
                  queryClient.invalidateQueries(['tiers']);
                });
              }
            });
          };
          const handelEdit = (item) => {
            setEditData(item);
            setOpen(true);
          };
          return (
            <div className="flex items-center gap-4">
              <PencilIcon
                size={20}
                className="hover:text-black cursor-pointer"
                onClick={() => handelEdit(item)}
              />
              <Trash2
                size={20}
                className="hover:text-black cursor-pointer"
                onClick={handelDelete}
              />
            </div>
          );
        },
      };
    });
  }

  return (
    <>
      <div className="p-0">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Tiers Management
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Customize and manage the Tiers for your clients.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button onClick={() => setOpen(true)}>Add Tier</Button>
          </div>
        </div>

        <Table
          tableData={data}
          onPageChange={(e) => {
            setPage(e);
          }}
          isLoading={isLoading}
        />
      </div>

      <AddTierDrawer
        open={open}
        setOpen={setOpen}
        isEdit={editData || false}
        clearEditData={() => setEditData()}
      />
    </>
  );
}
