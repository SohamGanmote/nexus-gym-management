import { useState } from 'react';
import Drawer from '../../../components/ui/drawer/Drawer';
import { RadioGroup } from '@headlessui/react';
import { createNewTheme } from '../../../http/post/postAPIs';
import { toast } from 'react-toastify';
import { queryClient } from '../../../App';
import { safeReload } from '../../../connect-to-db/renderer';

const colors = [
  { name: 'Purple', bgColor: '#A855F7' },    // vibrant purple
  { name: 'Blue', bgColor: '#3B82F6' },      // classic blue
  { name: 'Green', bgColor: '#10B981' },     // fresh green
  { name: 'Orange', bgColor: '#F97316' },    // bold orange
  { name: 'Red', bgColor: '#EF4444' },       // attention red
  { name: 'Teal', bgColor: '#14B8A6' },      // calm teal
  { name: 'Gray', bgColor: '#6B7280' },      // neutral gray
  { name: 'Amber', bgColor: '#FBBF24' },     // warm yellow
];

const GradientInput = ({ open, setOpen }) => {
  const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
  const [gradientStart, setGradientStart] = useState('#FFFFFF');
  const [gradientMiddle, setGradientMiddle] = useState('#FFFFFF');
  const [gradientEnd, setGradientEnd] = useState('#FFFFFF');

  const gradientStyle = {
    background: `linear-gradient(to right, ${gradientStart}, ${gradientMiddle}, ${gradientEnd})`,
  };

  const onSubmit = () => {
    if (
      primaryColor !== '#FFFFFF' &&
      gradientStart !== '#FFFFFF' &&
      gradientMiddle !== '#FFFFFF' &&
      gradientEnd !== '#FFFFFF'
    ) {
      createNewTheme({
        primary_color: primaryColor,
        gradient_start: gradientStart,
        gradient_middle: gradientMiddle,
        gradient_end: gradientEnd,
      }).then((data) => {
        if (data) {
          queryClient.invalidateQueries(['theme_layout']);
          setOpen(false);
          //safeReload();
        }
      });
    }
  };

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      onSave={onSubmit}
      resetData={() => { }}
      title="Create New Theme"
    >
      <div className="p-4">
        {/* Primary Color Selector */}
        <div className="mb-6">
          <RadioGroup value={primaryColor} onChange={setPrimaryColor}>
            <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900 mb-4">
              Primary Color:
            </RadioGroup.Label>
            <div className="grid grid-cols-8 gap-4">
              {colors.map((color) => (
                <RadioGroup.Option
                  key={color.name}
                  value={color.bgColor}
                  style={{ backgroundColor: color.bgColor }}
                  className={`relative flex cursor-pointer items-center justify-center rounded-full p-0.5 h-9 w-9 ${color.bgColor === primaryColor
                    ? 'border border-opacity-10'
                    : ''
                    }`}
                >
                  <RadioGroup.Label as="span" className="sr-only">
                    {color.name}
                  </RadioGroup.Label>
                  <span
                    aria-hidden="true"
                    className={`h-8 w-8 rounded-full ${color.bgColor === primaryColor && 'border-2'
                      }`}
                  />
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Gradient Preview */}
        <div
          style={gradientStyle}
          className="h-32 w-full rounded-md mb-6 border border-gray-300 shadow-inner"
        >
          <p className="text-white text-center flex items-center justify-center h-full font-semibold">
            Gradient Preview
          </p>
        </div>

        {/* Gradient Start Selector */}
        <div className="mb-6">
          <RadioGroup value={gradientStart} onChange={setGradientStart}>
            <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900 mb-4">
              Gradient Start:
            </RadioGroup.Label>
            <div className="grid grid-cols-8 gap-4">
              {colors.map((color) => (
                <RadioGroup.Option
                  key={color.name}
                  value={color.bgColor}
                  style={{ backgroundColor: color.bgColor }}
                  className={`relative flex cursor-pointer items-center justify-center rounded-full p-0.5 h-9 w-9 ${color.bgColor === gradientStart
                    ? 'border border-opacity-10'
                    : ''
                    }`}
                >
                  <RadioGroup.Label as="span" className="sr-only">
                    {color.name}
                  </RadioGroup.Label>
                  <span
                    aria-hidden="true"
                    className={`h-8 w-8 rounded-full ${color.bgColor === gradientStart && 'border-2'
                      }`}
                  />
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Gradient Middle Selector */}
        <div className="mb-6">
          <RadioGroup value={gradientMiddle} onChange={setGradientMiddle}>
            <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900 mb-4">
              Gradient Middle:
            </RadioGroup.Label>
            <div className="grid grid-cols-8 gap-4">
              {colors.map((color) => (
                <RadioGroup.Option
                  key={color.name}
                  value={color.bgColor}
                  style={{ backgroundColor: color.bgColor }}
                  className={`relative flex cursor-pointer items-center justify-center rounded-full p-0.5 h-9 w-9 ${color.bgColor === gradientMiddle
                    ? 'border border-opacity-10'
                    : ''
                    }`}
                >
                  <RadioGroup.Label as="span" className="sr-only">
                    {color.name}
                  </RadioGroup.Label>
                  <span
                    aria-hidden="true"
                    className={`h-8 w-8 rounded-full ${color.bgColor === gradientMiddle && 'border-2'
                      }`}
                  />
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Gradient End Selector */}
        <div className="mb-6">
          <RadioGroup value={gradientEnd} onChange={setGradientEnd}>
            <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900 mb-4">
              Gradient End:
            </RadioGroup.Label>
            <div className="grid grid-cols-8 gap-4">
              {colors.map((color) => (
                <RadioGroup.Option
                  key={color.name}
                  value={color.bgColor}
                  style={{ backgroundColor: color.bgColor }}
                  className={`relative flex cursor-pointer items-center justify-center rounded-full p-0.5 h-9 w-9 ${color.bgColor === gradientEnd
                    ? 'border border-opacity-10'
                    : ''
                    }`}
                >
                  <RadioGroup.Label as="span" className="sr-only">
                    {color.name}
                  </RadioGroup.Label>
                  <span
                    aria-hidden="true"
                    className={`h-8 w-8 rounded-full ${color.bgColor === gradientEnd && 'border-2'
                      }`}
                  />
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      </div>
    </Drawer>
  );
};

export default GradientInput;
