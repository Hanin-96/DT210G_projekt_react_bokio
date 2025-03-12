import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";

function layout() {
  return (
    <>
     <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
     
    </>
  )
}

export default layout


