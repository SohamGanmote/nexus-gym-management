import { Calendar, CreditCard, X } from 'lucide-react';
import Button from '../../../components/ui/button/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Reminders = ({ reminderData }) => {
  const redirect = useNavigate();

  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (reminderData && reminderData.length > 0) {
      setReminders(
        reminderData.slice(0, 3).map((item) => {
          return {
            id: item.reminder_id,
            icon:
              item.reminder_type === "payment_due" ? (
                <CreditCard className="w-5 h-5" />
              ) : (
                <Calendar className="w-5 h-5" />
              ),
            title: item.reminder_type === "payment_due" ? "Payment Due" : "Gym Visit",
            description: item.description,
          };
        })
      );
    }
  }, [reminderData])

  // Delete reminder function
  const deleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg border mt-6 h-fit">
      <h2 className="text-lg mb-4 flex items-center justify-between">
        <span className="font-semibold">Reminders</span>
        <span className="cursor-pointer">
          <Button className={'text-sm'} onClick={() => redirect('/reminders')}>View All</Button>
        </span>
      </h2>
      <div className="overflow-auto h-56">
        {reminders.length === 0 ? (
          <p className="text-center text-gray-500 h-full flex items-center justify-center">
            No reminders at the moment
          </p>
        ) : (
          <ul className="space-y-4">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
              >
                <div className="flex items-center">
                  <span className="text-primary p-2 bg-white border rounded-full mr-4">
                    {reminder.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {reminder.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {reminder.description}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2"
                  onClick={() => deleteReminder(reminder.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reminders;
