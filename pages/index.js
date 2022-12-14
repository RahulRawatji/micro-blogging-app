import Head from 'next/head'
import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';

import Message from '../components/Message';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
export default function Home() {
  const [allPost, setAllPost] = useState([]);
  
  const getPost = async() => {
    const collectionRef = collection(db, 'post');
    const q = query(collectionRef, orderBy('timeStamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPost(snapshot.docs.map((doc)=>({...doc.data(), id: doc.id})))
    });

    return unsubscribe;
  };

  useEffect(() => {
    getPost();
  }, []);

  
  return (
    <div>
      <Head>
        <title>Micro Blogging</title>
        <meta name="description" content="A Micro Blogging Platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        <div>
          <h2>See What Other People are Saying</h2>
          {allPost.map(post => {
            return <Message {...post} key={post.id} >
              <Link href={{ pathname: `/${post.id}`, query:{...post} }}>
                <button>{post.comments?.length > 0 ? post.comments?.length : 0 } Comments</button>
              </Link>
            </Message>     
          })}
       
        </div>
      </main>
    </div>
  )
}
