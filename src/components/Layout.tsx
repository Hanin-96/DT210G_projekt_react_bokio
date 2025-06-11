import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";

function layout() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Footer />

    </>
  )
}

export default layout


