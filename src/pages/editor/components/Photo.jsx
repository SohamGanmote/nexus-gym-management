import { ImageDown } from 'lucide-react';
import logo from '../../../assets/logo.png';
import Button from '../../../components/ui/button/Button';
import html2canvas from 'html2canvas';
const Photo = ({
  beforeImage,
  afterImage,
  beforeWeight,
  afterWeight,
  title,
  description,
}) => {
  const downloadImage = () => {
    const photoElement = document.getElementById('photo-to-download');

    html2canvas(photoElement, {
      useCORS: true,
      scale: 2,
      logging: false,
    }).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'before-and-after.png';
      link.click();
    });
  };

  return (
    <>
      <div className="hidden md:block sm:flex sm:items-center mb-4">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Image Preview
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Preview your "before" and "after" images along with the filled
            details. Once satisfied, you can download the image to share your
            transformation story on social media.
          </p>
        </div>
      </div>

      <div className="hidden md:block justify-center p-4 bg-gray-100 border rounded-md mb-4">
        {/* Icon for information */}
        <h2 className="font-semibold text-xl text-gray-700 mb-2">
          Image Quality May Vary Based on Screen Size
        </h2>
        <p className="text-sm text-gray-600">
          The quality of the image preview may differ from the final output.
          Higher screen resolutions and screen height will result in better
          image quality.
        </p>
      </div>

      <div
        className="relative"
        style={{ width: '40rem', height: '40rem' }}
        id="photo-to-download"
      >
        {/* logo and titles */}
        <div className="absolute top-3 left-5 flex items-center gap-4">
          <img src={logo} alt="" className="rounded-full w-28" />
          <div className="uppercase font-extrabold -mt-4">
            <h1 className="text-white text-2xl pb-4">
              Nexus
            </h1>
            <h2 className="text-primary text-xl border-t-2">
              Our Transformation story
            </h2>
          </div>
        </div>

        {/* before and after images */}
        <div className="absolute top-[9rem] w-full flex justify-evenly text-[2rem]">
          <div className="bg-white h-[21rem] w-[17rem] z-10 rounded-md px-2">
            <div
              className="w-full h-[17rem] rounded-md mt-2"
              style={{
                backgroundImage: `url(${beforeImage ||
                  'https://via.placeholder.com/400x400.png?text=No+Image+Available'
                  })`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
              }}
            ></div>
            <h1 className="text-center -mt-3">
              <span className="text-primary font-extrabold uppercase opacity-80">
                Before
              </span>
              <span className="font-extrabold ml-4 text-gray-700">
                {beforeWeight || 0}kg
              </span>
            </h1>
          </div>
          <div className="bg-white h-[21rem] w-[17rem] z-10 rounded-md px-2">
            <div
              className="w-full h-[17rem] rounded-md mt-2"
              style={{
                backgroundImage: `url(${afterImage ||
                  'https://via.placeholder.com/400x400.png?text=No+Image+Available'
                  })`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
              }}
            ></div>
            <h1 className="text-center -mt-3">
              <span className="text-primary font-extrabold uppercase opacity-80">
                After
              </span>
              <span className="font-extrabold ml-4 text-gray-700">
                {afterWeight || 0}kg
              </span>
            </h1>
          </div>
        </div>

        {/* title and desc */}
        <div className="absolute top-[31rem] w-full z-10 px-8 break-words whitespace-normal">
          <h1 className="font-extrabold text-2xl text-gray-900 line-clamp-1 pb-4">
            {title || 'Title'}
          </h1>
          <p className="font-medium text-md">{description || 'Description'}</p>
        </div>

        {/* bg colors */}
        <div className="h-[70%] w-full bg-black"></div>
        <div className="h-[30%] w-full bg-primary opacity-80 -z-10"></div>
      </div>

      {beforeImage &&
        afterImage &&
        beforeWeight &&
        afterWeight &&
        title &&
        description && (
          <>
            <Button
              className="flex items-center gap-2 mt-4"
              onClick={downloadImage}
            >
              <ImageDown />
              Download
            </Button>
          </>
        )}
    </>
  );
};
export default Photo;
