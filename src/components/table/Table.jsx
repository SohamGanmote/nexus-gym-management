import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const Table = ({
  tableData,
  onPageChange,
  filterComponent = <></>,
  noDataTitle,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <>
        <div className="animate-pulse space-y-2 mt-6 p-4 border">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </>
    );
  }

  if (!tableData) {
    return (
      <p className="text-center text-lg text-gray-600 mt-6 p-4 border">
        No Records Found
      </p>
    );
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= tableData?.totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const { pageNo, totalPages } = tableData;
    const pageNumbers = [];
    const maxPagesToShow = isMobile ? 1 : 5;

    let startPage = Math.max(1, pageNo - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, pageNo + Math.floor(maxPagesToShow / 2));

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <>
      <div className="m-0 sm:m-6 mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          {filterComponent}
          <div className={'inline-block min-w-full py-2 align-middle'}>
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {tableData?.header?.map((item, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                {tableData?.data === undefined && (
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td
                        colSpan="100%"
                        className="text-center py-4 text-gray-500"
                      >
                        {noDataTitle || 'No Records'}
                      </td>
                    </tr>
                  </tbody>
                )}

                {tableData?.data?.length === 0 && (
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td
                        colSpan="100%"
                        className="text-center py-4 text-gray-500"
                      >
                        No Records
                      </td>
                    </tr>
                  </tbody>
                )}

                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData?.data?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      {Object.keys(item).map((key) => {
                        if (!key.includes('_id'))
                          return (
                            <td
                              key={key}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                            >
                              {typeof item[key] === 'function'
                                ? item[key]()
                                : item[key]}
                            </td>
                          );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-start sm:justify-end z-0">
        <nav
          aria-label="Pagination"
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(tableData?.pageNo - 1);
            }}
            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
              tableData?.pageNo === 1 ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
          </a>
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span
                key={index}
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
              >
                ...
              </span>
            ) : (
              <a
                key={index}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
                aria-current={tableData?.pageNo === page ? 'page' : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm ${
                  tableData?.pageNo === page
                    ? 'gradient-div text-white'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                } focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
              >
                {page}
              </a>
            ),
          )}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(tableData?.pageNo + 1);
            }}
            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
              tableData?.pageNo === tableData?.totalPages
                ? 'cursor-not-allowed opacity-50'
                : ''
            }`}
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </>
  );
};

export default Table;
