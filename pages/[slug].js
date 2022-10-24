import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, serverTimestamp, Timestamp, updateDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import Image from "next/image";

export default function Details() {
  const routes = useRouter();
  const routeData = routes.query;
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);

  const submitComment = async() => {
    if (!auth.currentUser) return routes.push('/auth/login');
    if (!comment) {
      toast.error(`Don't Leave an Empty Comment`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500
      })
      return;
    }
    const docRef = doc(db, 'post', routeData.id);
    
    await updateDoc(docRef, {
      comments: arrayUnion({
        comment,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      })
    });
    setComment("");
  }

  const getComments = async() => {
    const docRef = doc(db, 'post', routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllComments(snapshot.data().comments);
    });

    return unsubscribe;
  };

  useEffect(() => {
    if (!routes.isReady) return;
    getComments();
  }, [routes.isReady]);

  return <div>
    <Message {...routeData}></Message>
    <div className="my-4">
      <div className="flex gap-3">
      <input
        type='text'
        value={comment}
        placeholder="Post a comment"
        onChange={(e) => setComment(e.target.value)}
        className="bg-gray-700 w-full p-2 text-sm"
        ></input>
        <button className="bg-cyan-300 text-white py-2 px-4 text-sm" onClick={submitComment}>Comment</button>
      </div>
      <div className="py-6">
        <h2 className="font-bold ">Comments</h2>
        {allComments?.map(data => {
          return <div className="bg-white py-4 my-4 border-2 shadow-md" key={data.time}>
            <div className="flex gap-3 items-center m-3">
              <Image className="rounded-full " src={data.avatar} height="50" width="50" alt='userAvatar' />
              <h3>{data.userName}</h3>
            </div>
            <h3 className="px-4">{data.comment}</h3>
          </div>
        })}
      </div>
    </div>
  </div>
}