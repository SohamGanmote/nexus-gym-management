import logo from '../../assets/logo.png';
import { capitalizeFirstLetter, formatDate } from '../../utils/utils';
const Header = ({ invoiceData }) => {
  return (
    <>
      <header className="flex-col sm:flex sm:flex-row justify-between items-center mb-8">
        <div className="flex justify-start items-center gap-4">
          <img src={logo} alt="Gym Logo" className="sm:w-24 w-16" />
          <div className="text-gray-800">
            <h2 className="text-2xl font-bold">
              Nexus{' '}
              <span className="text-primary font-bold opacity-80">Gym</span>
            </h2>
          </div>
        </div>
        <div className="sm:text-right mt-10 sm:mt-0">
          <p className="text-gray-600 line-clamp-1">
            <span className="font-semibold">Invoice Number:</span>
            {invoiceData ? (
              invoiceData.invoiceNumber
            ) : (
              <span className="animate-pulse bg-gray-300 rounded-md h-4 w-32 inline-block"></span>
            )}
          </p>
          <h1 className="sm:text-3xl text-xl font-bold text-gray-800">
            Membership{' '}
            <span className="text-primary font-bold opacity-80">Invoice</span>
          </h1>
        </div>
      </header>

      <div className="flex justify-between mb-4">
        <p className="text-gray-600">
          <span className="font-semibold">Bill To:</span>{' '}
          {invoiceData ? (
            capitalizeFirstLetter(invoiceData.memberName)
          ) : (
            <span className="animate-pulse bg-gray-300 rounded-md h-4 w-32 inline-block"></span>
          )}
        </p>
        <p className="text-gray-600 text-right">
          <span className="font-semibold">Date:</span>{' '}
          {invoiceData ? (
            formatDate(invoiceData.date)
          ) : (
            <span className="animate-pulse bg-gray-300 rounded-md h-4 w-32 inline-block"></span>
          )}
        </p>
      </div>
    </>
  );
};
export default Header;
