import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { Trash2 } from 'lucide-react';
import { getReminder } from '../../http/get/getAPIs';
import { capitalizeFirstLetter } from '../../utils/utils';
import { deleteReminder } from '../../http/delete/deleteAPIs';
import { toast } from 'react-toastify';
import Table from '../../components/table/Table';
import Chip from '../../components/ui/chip/Chip';


const Reminders = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getReminder(),
  });

  if (!isLoading && data) {
    data.header = [
      'ID',
      'Name',
      'Mobile No',
      'Description',
      'Reminder Type',
      'Action',
    ];

    data.data = data.map((item) => {
      return {
        reminder_id: item.reminder_id,
        name: () => (
          <p className="font-bold">
            {capitalizeFirstLetter(item?.first_name)}{' '}
            {capitalizeFirstLetter(item?.last_name)}
          </p>
        ),
        mobile_no: `+91 ${item?.mobile_no}`,
        description: capitalizeFirstLetter(item.description),
        notification_type: () => <>
          {item.reminder_type === "re-visit" && <Chip
            warning={true}
          >
            Client Visit
          </Chip>}
          {item.reminder_type === "payment_due" && <Chip>
            Payment Due
          </Chip>}
        </>,
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
                deleteReminder(item.reminder_id).then((data) => {
                  refetch();
                });
              }
            });
          };
          return (
            <div className="flex items-center gap-4">
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
              Reminders
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              View & manege reminders.
            </p>
          </div>
        </div>

        <Table tableData={data} isLoading={isLoading} />
      </div>
    </>
  )
};
export default Reminders;
