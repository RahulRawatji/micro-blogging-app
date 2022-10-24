import Link from "next/link";
import Image from "next/image";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Navbar() {
  const [user, loding] = useAuthState(auth);

  return (<nav className=" flex justify-between items-center py-10">
    <Link href="/">
      <button className="text-lg font-medium">Creative Minds</button>
    </Link>
    <ul className="flex items-center">
      {!user && (
        <Link href="/auth/login">
          <a className="text-sm py-2 ml-8 px-4 bg-cyan-500 text-white rounded-lg font-medium" >Join Now</a>
        </Link>)
      }
      {user && (
        <div className="flex items-center gap-6">
          <Link href="/post">
            <button className="font-medium bg-cyan-500 text-white py-2 px-4 text-sm rounded-md">Post</button>
          </Link>
          <Link href="/dashboard">
          <Image src={user.photoURL} alt="userAvatar" width={50} height="50" className="v-10, rounded-full" />
          </Link>
        </div>
      )}
    </ul>
  </nav>)
}