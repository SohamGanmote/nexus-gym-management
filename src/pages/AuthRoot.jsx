import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthRoot = () => {
  const redirect = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      redirect('/');
    }
  }, []);

  return (
    <section>
      <Outlet />
    </section>
  );
};
export default AuthRoot;
