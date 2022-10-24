import Navbar from "./Navbar";

export default function Layout({children}) {
  return (<>
    <div className="mx-5 font-poppins md:mx-auto w-1/2 ">
      <Navbar />
      <main>{children}</main>
    </div>
  </>)
} 