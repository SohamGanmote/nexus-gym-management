const Spinner = () => {
  return (
    <div className="absolute top-0 left-0 w-full flex flex-col items-center justify-center h-screen space-y-4 bg-white">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-600 animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Spinner;
