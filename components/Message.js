import Image from "next/image";

export default function Message({ avatar, userName, description, children }) {
  return <div className="bg-white p-8 border-b-2 rounder-lg">
    <div className="flex items-center gap-2">
      <Image src={avatar} alt="userAvatar" width={50} height="50" className="v-10, rounded-full" />
      <h2>{userName}</h2>
    </div>
    <div className="py-4">
      <p className="">
        {description}
      </p>
    </div>
    {children}
  </div>
}