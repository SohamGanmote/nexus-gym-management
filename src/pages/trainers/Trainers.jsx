import { Eye, Pencil, PencilIcon, Trash2 } from 'lucide-react';
import Table from '../../components/table/Table';
import Button from '../../components/ui/button/Button';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getTrainers } from '../../http/get/getAPIs';
import { capitalizeFirstLetter } from '../../utils/utils';
import useDebounce from '../../hooks/useDebounce';
import { deleteTrainer } from '../../http/delete/deleteAPIs';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import AddTrainerDrawer from './components/AddTrainerDrawer';

export default function Trainers() {
  const [page, setPage] = useState(1);

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['trainer', page, debouncedSearchValue],
    queryFn: () => getTrainers({ page, search: searchValue }),
  });

  if (!isLoading && data) {
    data.header = ['ID', 'username', 'Name', 'Mobile No', 'Action'];

    data.data = data.trainers.map((item) => {
      return {
        user_id: item.admin_id,
        username: item.username,
        name: () => (
          <p className="font-bold">
            {capitalizeFirstLetter(item.first_name)}{' '}
            {capitalizeFirstLetter(item.last_name)}
          </p>
        ),
        mobile_no: `+91 ${item.mobile_no}`,
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
                deleteTrainer(item.admin_id).then((data) => {
                  refetch();
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
              Trainers
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the Trainer in your gym including their name, and
              role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button onClick={() => setOpen(true)}>Add Trainer</Button>
          </div>
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

      <AddTrainerDrawer
        open={open}
        setOpen={setOpen}
        isEdit={editData || false}
        clearEditData={() => setEditData()}
      />
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
