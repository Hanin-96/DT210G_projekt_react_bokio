import { createContext, useState, useContext, ReactNode, useEffect } from "react";

import { User, LoginCredentials, AuthResponse, AuthContextType, RegisterCredentials } from "../types/auth.types";

//Skapar context
const AuthContext = createContext<AuthContextType | null>(null);


//Renderar komponenter
interface AuthProviderProps {
    children: ReactNode
}

//Provider som lagrar context innehåll och skickar ut till komponent
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    //Registrering
    const register = async (credentials: RegisterCredentials) => {
        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(credentials)
            })

            if (!response.ok) {
                const data = await response.json();
                console.log(data.message)
                throw new Error("Registrering misslyckades");

            }

        } catch (error) {
            throw Error;
        }

    }

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(credentials)
            }
            )
            if (!response.ok) {
                throw new Error("Inloggning misslyckades");
            } else {
                const loginData = await response.json() as AuthResponse;
                console.log("LoginData från servern:", loginData);

                console.log("LoginData user:", loginData.user);

                console.log("LoginData user:", loginData.token);

                //Sätta user state
                setUser(loginData.user);

            }


        } catch (error) {
            throw error;
        }

    }

    //Logga ut
    const logout = async () => {
        try {
            const response = await fetch("http://localhost:3000/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Utloggning misslyckades");
            } else {
                //Sätta user state
                setUser(null);
            }


        } catch (error) {
            //Sätta user state
            console.log(error);
            throw new Error("Utloggning misslyckades");
        }

    }



    //Validera token för inloggad
    const checkToken = async () => {

        try {
            const response = await fetch("http://localhost:3000/userpage", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }

        } catch {
            setUser(null);
        }
    }


    //Köra metod för kontroll om användare är inne
    useEffect(() => {
        checkToken();

        //Kontrollera användares token var 30 min
        const intervalId = setInterval(() => {
            checkToken();
        }, 1800000);

        //Rensa intervallet
        return () => clearInterval(intervalId);
    }, [])



    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth måste användas inom en AuthProvider")
    }

    return context;
}