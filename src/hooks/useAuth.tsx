import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { userInfoAtom } from '@/store/userInfo';

function useAuth() {
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const router = useRouter();

  useEffect(() => {
    // Check if userInfo has necessary properties to consider user as logged in
    if (!userInfo || !userInfo.user_virtual_id) {
      // Redirect to login page
      router.push('/');
    }
  }, [userInfo, router, setUserInfo]);

  return userInfo;
}

export default useAuth;
