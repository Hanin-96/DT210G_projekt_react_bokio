import { Navigate } from "react-router-dom";
import { createContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { ProtectedRouteResponse } from "../types/auth.types";

//Skapar context
const ProtectedRouteContext = createContext<ProtectedRouteResponse | null>(null);

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    //Finns användare i state dvs inloggad?
    const { user } = useAuth();

    //Finns ej användare, redirect till login sida
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <>
            <ProtectedRouteContext.Provider value={{user}}>
                {children}
            </ProtectedRouteContext.Provider>
        </>
    )
}

export default ProtectedRoute