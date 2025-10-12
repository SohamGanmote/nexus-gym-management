import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SideBar from '../components/sidebar/Sidebar';

const Root = () => {
  const redirect = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      redirect('/auth/login');
    }
  }, []);

  return (
    <section className='rounded-t-xl overflow-hidden'>
      <SideBar Outlet={Outlet} />
    </section>
  );
};
export default Root;
