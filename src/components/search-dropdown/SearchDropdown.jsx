import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: 'none', // Removes border
    display: 'flex',
    alignItems: 'center',
    borderRadius: '0.375rem', // rounded-md
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
    margin: '0px', // Removes margin
    padding: '0px', // Removes padding
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af', // placeholder:text-gray-400
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#111827', // text-gray-900
  }),
  input: (provided) => ({
    ...provided,
    color: '#111827', // text-gray-900
    padding: 0,
    margin: 0,
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: '0.5rem', // Add some space between the input and dropdown
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Dropdown shadow
    borderRadius: '0.375rem', // rounded-md
  }),
};

const SearchDropdown = ({
  id,
  label,
  value,
  onChange,
  onInputChange,
  options,
  placeholder,
  isClearable = false,
  additionalClassName = '',
  reversed = false,
  ...props
}) => {
  if (reversed) {
    options = options.reverse();
  }
  return (
    <div className={`${additionalClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Select
        id={id}
        value={value}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
        placeholder={placeholder}
        isClearable={isClearable}
        styles={customStyles}
        className="block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 sm:text-sm sm:leading-6 appearance-none"
        {...props}
      />
    </div>
  );
};

export default SearchDropdown;
