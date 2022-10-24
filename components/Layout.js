import Navbar from "./Navbar";

export default function Layout({children}) {
  return (<>
    <div className="mx-5 font-poppins md:mx-auto">
      <Navbar />
      <main>{children}</main>
    </div>
  </>)
} 