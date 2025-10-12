import { useState } from 'react';
import Button from '../../components/ui/button/Button';
import Toggle from '../../components/ui/toggle/Toggle';
import { getTheme } from '../../http/get/getAPIs';
import Table from '../../components/table/Table';
import { AlertTriangle, CircleSlash, Trash2 } from 'lucide-react';
import { updateThemeStatus } from '../../http/put/putAPIs';
import { useQuery } from '@tanstack/react-query';
import GradientInput from './components/GradientInput';
import { toast } from 'react-toastify';
import { deleteTheme } from '../../http/delete/deleteAPIs';
import Swal from 'sweetalert2';
import { queryClient } from '../../App';
import { safeReload } from '../../connect-to-db/renderer';

export default function Theme() {
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['theme', page],
    queryFn: () => getTheme({ page }),
  });

  if (!isLoading && data) {
    data.header = ['Theme ID', 'Primary Color', 'Gradient', 'Status', 'Action'];

    data.data = data.data.map((item) => {
      return {
        theme_id: item.theme_id,
        primary_color: () => {
          return (
            <div
              className="h-10 w-20 text-white rounded-md flex justify-center items-center"
              style={{ backgroundColor: item.primary_color }}
            >
              {item.primary_color}
            </div>
          );
        },
        gradient: () => {
          return (
            <div
              className="h-10 w-80 rounded-md"
              style={{
                background: `linear-gradient(90deg, ${item.gradient_start}, ${item.gradient_middle}, ${item.gradient_end})`,
              }}
            ></div>
          );
        },
        status: () => {
          return (
            <Toggle
              enabled={item.is_active}
              setEnabled={() => {
                updateThemeStatus(item.theme_id).then(() => {
                  refetch();
                  queryClient.invalidateQueries(['theme_layout']);
                  //safeReload();
                });
              }}
            />
          );
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
                deleteTheme(item.theme_id).then((data) => {
                  queryClient.invalidateQueries(['theme_layout']);
                });
              }
            });
          };
          if (item.is_active) {
            return <CircleSlash
              size={20}
              className="hover:text-black cursor-pointer"
            />
          }
          return (
            <Trash2
              size={20}
              className="hover:text-black cursor-pointer"
              onClick={handelDelete}
            />
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
              Theme Management
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Customize and manage the visual themes for your app.
            </p>
            <p className="mt-1 text-xs text-gray-500 italic flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-gray-500" />
              Note: You need to restart the app after changing the theme for it to be applied.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Button onClick={() => setOpen(true)}>Add Theme</Button>
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

      <GradientInput open={open} setOpen={setOpen} />
    </>
  );
}
