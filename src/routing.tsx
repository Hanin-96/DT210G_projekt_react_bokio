import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from "./pages/RegisterLogin/RegisterPage";
import LoginPage from "./pages/RegisterLogin/LoginPage";
import MyPage from "./pages/MyPage";
import ProtectedRoute from "./context/ProtectedRoute";
import { ReviewProvider } from "./context/ReviewContext";
import BookPage from "./pages/BookPage/BookPage";
import { BookProvider } from "./context/BookContext";


const router = createBrowserRouter([
    {
        //Huvudrouting
        path: "/",
        element:
            (
                <BookProvider>
                    <ReviewProvider>
                        <Layout />
                    </ReviewProvider>
                </BookProvider>
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
                path: "/book/:bookId",
                element:
                    (
                        <BookPage />
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