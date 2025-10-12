import { Eye, Pencil, PencilIcon, Trash2 } from 'lucide-react';
import Table from '../../components/table/Table';
import Button from '../../components/ui/button/Button';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getUsers } from '../../http/get/getAPIs';
import { capitalizeFirstLetter, formatDate } from '../../utils/utils';
import useDebounce from '../../hooks/useDebounce';
import Chip from '../../components/ui/chip/Chip';
import { useNavigate } from 'react-router-dom';
import AddUserDrawer from './components/AddUserDrawer';
import { deleteUser } from '../../http/delete/deleteAPIs';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

export default function Users() {
  const redirect = useNavigate();

  const [page, setPage] = useState(1);

  const [searchValue, setSearchValue] = useState('');

  const filters = sessionStorage.getItem('filterValue');
  const [filterValue, setFilterValue] = useState(filters ? filters : 'all');

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['users', page, debouncedSearchValue, filterValue],
    queryFn: () => getUsers({ page, search: searchValue, filter: filterValue }),
  });

  if (!isLoading && data) {
    data.header = [
      'ID',
      'Name',
      'Date of Birth',
      'Mobile No',
      'Membership',
      'Action',
    ];

    data.data = data.data.map((item) => {
      return {
        user_id: item.user_id,
        name: () => (
          <p className="font-bold">
            {capitalizeFirstLetter(item.first_name)}{' '}
            {capitalizeFirstLetter(item.last_name)}
          </p>
        ),
        dob: item.dob ? formatDate(item.dob.split('T')[0]) : 'Not Added',
        mobile_no: `+91 ${item.mobile_no}`,
        membership: () => {
          if (item.state === "Inquiry") return <Chip warning={true} />;
          if (item.state === "Active") return <Chip isActive={true} />;
          else return <Chip />;
        },
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
                deleteUser(item.user_id).then((data) => {
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
              <Eye
                size={20}
                className="hover:text-black cursor-pointer"
                onClick={() => redirect(`/users/${item.user_id}`)}
              />
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
              Users
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name,
              title, email and role.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button onClick={() => setOpen(true)}>Add user</Button>
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
              filterValue={filterValue}
              setFilterValue={setFilterValue}
            />
          }
        />
      </div>

      <AddUserDrawer
        open={open}
        setOpen={setOpen}
        isEdit={editData || false}
        clearEditData={() => setEditData()}
        refetch={refetch}
      />
    </>
  );
}

const TableFilters = ({
  searchValue,
  setSearchValue,
  filterValue,
  setFilterValue,
}) => {
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

      <div className="sm:w-1/3 w-1/2">
        <select
          value={filterValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setFilterValue(newValue);
            sessionStorage.setItem('filterValue', newValue);
          }}
          className="block sm:w-1/3 w-full rounded-md border-0 p-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="inquiry">Inquiry</option>
        </select>
      </div>
    </div>
  );
};
