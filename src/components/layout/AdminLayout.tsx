import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { userApi } from '@/api/user.api';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { allowedRoles } from '@/const/role';


export const AdminLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await userApi.getUserProfile();
      if (!allowedRoles.includes(res.roleId.name)) {
        navigate('/login');
        toast('Access denied. You do not have admin privileges.');
        return;
      }
    }
    fetchUserProfile();
  },[])



  return (
    <div className="flex h-screen overflow-hidden w-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
