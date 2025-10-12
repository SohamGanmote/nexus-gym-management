import React, { useState } from 'react';
import Button from '../../components/ui/button/Button';
import Photo from './components/Photo';

const Editor = () => {
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforeWeight, setBeforeWeight] = useState('');
  const [afterWeight, setAfterWeight] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Handle image file changes and set preview URLs
  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Reset all inputs
  const resetInputs = () => {
    setBeforeImage(null);
    setAfterImage(null);
    setBeforeWeight('');
    setAfterWeight('');
    setTitle('');
    setDescription('');
  };

  return (
    <>
      <div className="p-0 block">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Before and After Image Editor
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Upload a "before" and an "after" image to compare the results. You
              can preview both images and add details like weight, title, and
              description.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <Button onClick={resetInputs} className="w-full sm:w-auto">
              Reset Inputs
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-4 flex items-center gap-4">
            {/* Before Image Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Before Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setBeforeImage)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
              />
            </div>

            {/* After Image Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                After Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setAfterImage)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
              />
            </div>
          </div>

          <div className="mb-4 flex items-center gap-4">
            {/* Before Weight Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Before Weight
              </label>
              <input
                type="number"
                value={beforeWeight}
                onChange={(e) => setBeforeWeight(e.target.value)}
                placeholder="Enter before weight"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
              />
            </div>

            {/* After Weight Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                After Weight
              </label>
              <input
                type="number"
                value={afterWeight}
                onChange={(e) => setAfterWeight(e.target.value)}
                placeholder="Enter after weight"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setDescription(e.target.value);
                }
              }}
              placeholder="Enter a description"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm sm:text-sm"
              rows="4"
            />
          </div>
        </div>

        <div className="overflow-auto">
          <Photo
            beforeImage={beforeImage}
            afterImage={afterImage}
            beforeWeight={beforeWeight}
            afterWeight={afterWeight}
            title={title}
            description={description}
          />
        </div>
      </div>
    </>
  );
};

export default Editor;
