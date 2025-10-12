import { useEffect, useState } from 'react';
import { getActiveTheme } from '../../http/get/getAPIs';
import { getHoverColor } from '../../utils/utils';
import Spinner from '../ui/spinner/Spinner';

const ThemeLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [primaryColor, setPrimaryColor] = useState('#ea580c');
  const [gradientStart, setGradientStart] = useState('rgba(251, 146, 60, 1)');
  const [gradientMiddle, setGradientMiddle] = useState('rgba(249, 115, 22, 1)');
  const [gradientEnd, setGradientEnd] = useState('rgba(234, 88, 12, 1)');


  useEffect(() => {
    const getData = async () => {
      const data = await getActiveTheme();

      if (data) {
        setPrimaryColor(data.primary_color);
        setGradientStart(data.gradient_start);
        setGradientMiddle(data.gradient_middle);
        setGradientEnd(data.gradient_end);
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    getData();
  }, []);

  useEffect(() => {
    const setCSSVars = () => {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', primaryColor);
      root.style.setProperty('--gradient-start', gradientStart);
      root.style.setProperty('--gradient-middle', gradientMiddle);
      root.style.setProperty('--gradient-end', gradientEnd);
      root.style.setProperty('--hover-gradient-start', getHoverColor(gradientStart));
      root.style.setProperty('--hover-gradient-middle', getHoverColor(gradientMiddle));
      root.style.setProperty('--hover-gradient-end', getHoverColor(gradientEnd));
    };
    setCSSVars();
  }, [primaryColor, gradientStart, gradientMiddle, gradientEnd]);

  if (isLoading) {
    return <Spinner />
  }

  const hoverGradientStart = getHoverColor(gradientStart);
  const hoverGradientMiddle = getHoverColor(gradientMiddle);
  const hoverGradientEnd = getHoverColor(gradientEnd);

  return (<section
    style={{
      '--primary-color': primaryColor,
      '--gradient-start': gradientStart,
      '--gradient-middle': gradientMiddle,
      '--gradient-end': gradientEnd,
      '--hover-gradient-start': hoverGradientStart,
      '--hover-gradient-middle': hoverGradientMiddle,
      '--hover-gradient-end': hoverGradientEnd,
    }}
  >
    {children}
  </section>
  );
};
export default ThemeLayout;
