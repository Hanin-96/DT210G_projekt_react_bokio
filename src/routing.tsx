import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ReviewPage from "./pages/ReviewPage";
import RegisterPage from "./pages/RegisterLogin/RegisterPage";
import LoginPage from "./pages/RegisterLogin/LoginPage";
import MyPage from "./pages/MyPage";
import ProtectedRoute from "./context/ProtectedRoute";
import { ReviewProvider } from "./context/ReviewContext";


const router = createBrowserRouter([
    {
        //Huvudrouting
        path: "/",
        element:
            (
                <ReviewProvider>
                <Layout />
                </ReviewProvider>
            ),
        children: [
            {
                path: "/",
                element:
                    (
                        <HomePage />
                    ),
            },
            {
                path: "/reviews",
                element:
                    (
                        <ReviewPage />
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
            },
            {
                path: "/mypage",
                element:
                    (
                        <ProtectedRoute>
                            <MyPage />
                        </ProtectedRoute>
                    ),
            }
        ]
    }
]);

export default router;