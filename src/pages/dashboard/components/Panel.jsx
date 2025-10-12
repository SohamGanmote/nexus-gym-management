import { Dumbbell } from 'lucide-react';
import Button from '../../../components/ui/button/Button';
import { capitalizeFirstLetter, decodeJWT } from '../../../utils/utils';
import banner from '../../../assets/banner.jpg';

const Panel = ({ setAddUserDrawer }) => {
  const user = decodeJWT();
  {
    user?.role === 'admin'
      ? 'Master Admin'
      : `${capitalizeFirstLetter(
        user?.first_name,
      )} ${capitalizeFirstLetter(user?.last_name)}`;
  }
  return (
    <>
      <div
        className="relative overflow-hidden rounded-lg border border-gray-200 shadow-lg min-h-[16rem] sm:min-h-[9rem] w-full mb-6"
        style={{
          // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(https://static.vecteezy.com/system/resources/previews/026/781/389/non_2x/gym-interior-background-of-dumbbells-on-rack-in-fitness-and-workout-room-photo.jpg)`,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${banner})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex flex-col sm:flex-row justify-between items-start text-center p-10 text-white">
          <div>
            <h3 className="text-2xl font-bold text-left">
              Welcome back!{' '}
              {user?.role === 'admin'
                ? 'Admin.'
                : capitalizeFirstLetter(user?.first_name)}
            </h3>
            <p className="mt-2 text-lg text-left">
              Lead with efficiency. Manage with ease.
            </p>
          </div>

          <Button
            className="mt-4 flex gap-2 items-center"
            onClick={() => setAddUserDrawer(true)}
          >
            <Dumbbell className="w-5 h-5 text-white" />
            Add Inquiry
          </Button>
        </div>
      </div>
    </>
  );
};
export default Panel;
