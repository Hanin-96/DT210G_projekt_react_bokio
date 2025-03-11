import { Outlet } from "react-router-dom";

function layout() {
  return (
    <>
     
      <main>
        <Outlet />
      </main>
     
    </>
  )
}

export default layout


