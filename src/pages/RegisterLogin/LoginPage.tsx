import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import RegisterStyle from "./RegisterStyle.module.css";
import { ChevronRight, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  //States för formuläret
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //State för errorhantering
  const [error, setError] = useState("");

  //Kontrollera användare
  useEffect(() => {
    if (user) {
      console.log("User updated:", user);
      navigate("/mypage");
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Nollställ error state och success meddelande
    setError("");

    try {
      if (username === "" || password === "") {
        return setError("Fyll i varje fält!")

      } else if (!username && !password) {
        return setError("Fyll i varje fält!")
      }

      await login({ username, password });

      //Nollställ inputsfälten
      setUsername("");
      setPassword("");

    } catch (error) {
      setError("Fel användarnamn/lösenord")
    }
  }
  return (
    <>
      <div className={RegisterStyle.registerForm}>
        <h1>Inloggning</h1>
        <div className={RegisterStyle.registerIcon}>
          <UserRound />
        </div>
        <form onSubmit={handleSubmit}>

          <div>
            <label htmlFor="username">Användarnamn:</label>
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div>
            <label htmlFor="password">Lösenord:</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>

          {
            error && <span style={{ fontSize: "1.5rem", color: "red" }}>{error}</span>
          }

          <button type="submit">Logga in</button>
        </form>

        <div>
          <Link to="/register" style={{ color: "white", display: "flex", marginTop: "1rem", marginBottom: "10rem", justifyContent: "flex-end", alignItems: "center", fontSize: "1.5rem" }}>Inget användarkonto? Registrera<ChevronRight /></Link>
        </div>
      </div>
    </>
  )
}


export default LoginPage