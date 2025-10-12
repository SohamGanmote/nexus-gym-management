import { queryClient } from '../../../App';
import { safeReload } from '../../../connect-to-db/renderer';

export default function Drawer({
  open,
  setOpen,
  children,
  onSave,
  title,
  invalidate,
  resetData,
}) {
  const close = () => {
    if (invalidate) {
      // queryClient.invalidateQueries([invalidate]);
    }
    resetData();
    setOpen(false);
    //safeReload();
  };
  return (
    <div>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={close}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-screen max-w-md bg-white shadow-xl transform transition-transform z-40 duration-500 ${open ? 'translate-x-0' : 'translate-x-full'
          } mt-10`}
      >
        <div className="flex h-full flex-col divide-y divide-gray-200">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-start justify-between">
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                {title}
              </h2>
              <button
                type="button"
                className="ml-3 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={close}
              >
                <span className="sr-only">Close panel</span>
                {/* Close Icon */}
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="relative mt-6 flex-1">{children}</div>
          </div>

          <div className="flex-shrink-0 px-4 py-4 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
              onClick={close}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-4 inline-flex justify-center rounded-md px-3 py-2 text-white gradient-button text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={onSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
