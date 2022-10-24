import { auth, db } from "../utils/firebase";
import { Router, useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";


export default function Post() {

  const [post, setPost] = useState({ description: "" });  
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;
  
  const submitPost = async (e) => {
    e.preventDefault();
    if (!post.description) {
      const newLocal = 'Description Field Empty';
      toast.error(newLocal, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1300,
      });
      return;
    }

    if (post.description.length > 300) {
      const newLocal = 'Description Too Long';
      toast.error(newLocal, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1300,
      });
      return;
    }
    if (post?.hasOwnProperty('id')) {
      const docRef = doc(db, 'post', post.id);
      const updatedPost = { ...post, timeStamp: serverTimestamp() };
      
      await updateDoc(docRef, updatedPost);
      
      return route.push('/');

    } else {
      const collectionRef = collection(db, 'post');
      
      await addDoc(collectionRef, {
        ...post,
        timeStamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        userName: user.displayName,
      })
      setPost({ description: "" });   
      toast.success('New Post has been made', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500

      })
      return route.push('/');
    }
   
  };

  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push('/auth/login');
    if (routeData.id) {
      setPost({description: routeData.description, id: routeData.id})
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);


  return <>
    <div className="my-10 p-10 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-poppins">{post.hasOwnProperty('id') ? "Edit Your Post" : "Create a new Post"}</h1>
        <div className="py-2">
          <h3 className="text-lg font-poppins ">Description</h3>
          <textarea value={post.description}
            onChange={(e) => setPost({...post, description: e.target.value })}
            className="h-44 w-full text-white bg-gray-800 rounded-lg p-2 border-2 my-4"></textarea>
          <p className={`py-1 text-cyan-600 font-medium ${post.description.length > 300 ? "text-red-600": ""}`}>{post.description.length }/300</p>
        </div>
        <button type="submit" className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg">Submit</button>
      </form>
    </div>
  </>
}