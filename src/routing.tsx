import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/Register/RegisterPage";
import LoginPage from "./pages/LoginPage";


const router = createBrowserRouter([
    {
        //Huvudrouting
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element:
                    (
                        <HomePage />
                    ),
            },
            {
                path: "/register",
                element:
                    (
                        <RegisterPage />

                    ),
            },
            {
                path: "/login",
                element:
                    (
                        <LoginPage />

                    ),
            }
        ]
    }
]);

export default router;