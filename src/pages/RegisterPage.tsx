import { ChevronRight, UserRoundPlus } from "lucide-react"
import { useState } from "react"

//Context api för Auth
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {

  const { register } = useAuth();
  const navigate = useNavigate();

  //States för formuläret
  const [firstname, setFirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msgRegister, setmsgRegister] = useState("");



  //State för errorhantering
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Nollställ error state och success meddelande
    setError("");
    setmsgRegister("");

    try {
      if (firstname === "" || lastname === "" || email === "" || username === "" || password === "") {
        return setError("Fyll i varje fält!")
      }
      await register({ firstname, lastname, email, username, password });
      setmsgRegister("Användarkonto har registrerats")

      //Nollställ inputsfälten
      setFirstname("");
      setlastname("");
      setEmail("");
      setUsername("");
      setPassword("");

    } catch (error) {
      setError("Det gick inte att registrera användarkonto")
    }
  }
  return (
    <>
      <h1>Registrering</h1>

      <UserRoundPlus />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">Förnamn:</label>
          <input
            type="text"
            id="firstname"
            required
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)} />
        </div>

        <div>
          <label htmlFor="lastname">Efternamn:</label>
          <input
            type="text"
            id="lastname"
            required
            value={lastname}
            onChange={(e) => setlastname(e.target.value)} />
        </div>

        <div>
          <label htmlFor="email">E-post:</label>
          <input
            type="text"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
        </div>

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

        <button type="submit">Registrera</button>
      </form>

      {
        msgRegister && <p>{msgRegister}</p>
      }
      <div>
        <button type="button" onClick={() => navigate("/loginpage")}>Inloggning <ChevronRight /></button>
      </div>

    </>
  )
}

export default RegisterPage