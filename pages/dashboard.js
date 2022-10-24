import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Link from 'next/link';

import Message from '../components/Message';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  
  useEffect(() => {
    getData();
  }, [user, loading]);
  
  const getData = () => {
    if (loading) return;
    if (!user) {
      return route.push("/auth/login");
    }
    const collectionRef = collection(db, "post");
    const q = query(collectionRef, where('user', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc)=>({...doc.data(), id: doc.id})))
    });
    
    return unsubscribe;
  };

  const deletePost = async(id) => {
    const docRef = doc(db, 'post', id);
    await deleteDoc(docRef);
  };

  return (
    <div>
      <h1 className='text-poppins'>Your Post</h1>
      <div>
        {posts.map(post => {
          return <Message {...post} key={post.id} >
            <div className='flex gap-4 '>
              <button className='text-pink-500 flex items-center justify-center gap-2 py-2  text-sm' onClick={() => deletePost(post.id)}><BsTrash2Fill size={20} />Delete</button>
              <Link href={{pathname: "/post", query: post}}>
              <button  className='text-teal-500 flex items-center justify-center gap-2 py-2  text-sm'><AiFillEdit size={20}/> Edit</button></Link>
            </div>
          </Message>
        })}
      </div>
      <button className="font-medium text-white bg-gray-800 py-2 px-4 rounded-md my-6" onClick={()=> auth.signOut()}>Sign Out</button>
    </div>
  )
}