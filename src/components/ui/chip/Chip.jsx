const Chip = ({
  isActive = false,
  warning = false,
  title = '',
  customBgColor = '',
  customTextColor = '',
  customRingColor = '',
  children = '',
}) => {
  // Default content based on current logic
  let chipContent = '';
  let bgColor = customBgColor || 'bg-red-50'; // Default background
  let textColor = customTextColor || 'text-red-700'; // Default text color
  let ringColor = customRingColor || 'ring-red-600/20'; // Default ring color

  if (title) {
    chipContent = title;
    bgColor = customBgColor || 'bg-slate-100';
    textColor = customTextColor || 'text-black';
    ringColor = customRingColor || 'ring-gray-500';
  } else if (warning) {
    chipContent = 'Inquiry';
    bgColor = customBgColor || 'bg-yellow-50';
    textColor = customTextColor || 'text-yellow-700';
    ringColor = customRingColor || 'ring-yellow-600/20';
  } else if (isActive) {
    chipContent = 'Active';
    bgColor = customBgColor || 'bg-green-50';
    textColor = customTextColor || 'text-green-700';
    ringColor = customRingColor || 'ring-green-600/20';
  } else {
    chipContent = 'Inactive';
  }

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${bgColor} ${textColor} ring-1 ring-inset ${ringColor}`}
    >
      {children || chipContent}
    </span>
  );
};

export default Chip;
