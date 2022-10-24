import { AiFillGoogleSquare } from 'react-icons/ai';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

export default function Login(params) {

  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const googleProvider = new GoogleAuthProvider();
  
  useEffect(() => {
    if (user) {
      route.push('/');
    } else {
      console.log('Login');
    }
  },[user])
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push('/');
    } catch (error) {
      console.log(error);
    }
  }
  return (<div className="shadow-xl mt-32 p-10 text-gray-500">
    <h2 className="text-2xl font-medium">Join Now</h2>
    <div className="py-4 flex-col"> 
      <h3 className="py-4 ">Sign in with one of the Provider</h3>
      <button onClick={GoogleLogin} className='flex gap-3 bg-slate-500 text-white p-2 rounded-md'><AiFillGoogleSquare className="" size="25" title='Google'/> Sign in with Google</button>
    </div>
  </div>)
}