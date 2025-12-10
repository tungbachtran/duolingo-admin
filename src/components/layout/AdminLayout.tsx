import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { userApi } from '@/api/user.api';
import { toast } from 'sonner';
import { allowedRoles } from '@/const/role';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/spinner';


export const AdminLayout = () => {
  const navigate = useNavigate();
  const { data, isFetching } = useQuery({ queryKey: ['userProfile'], queryFn: userApi.getUserProfile })
  if (isFetching) {
    return (
      <>

        <div className='m-auto flex items-center justify-center gap-10 w-screen  '>
          <Spinner className='size-10' />
          <h1>Đang tải</h1>
        </div>

      </>
    )
  }

  if (data && !allowedRoles.includes(data.roleId.name)) {
    navigate('/login');
    toast('Access denied. You do not have admin privileges.');
    return;
  }

  return (
    <div className="flex h-screen overflow-hidden w-screen">
      <Sidebar user={data} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
