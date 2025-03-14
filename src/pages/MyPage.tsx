import { useAuth } from "../context/AuthContext";


function MyPage() {
    const { user } = useAuth();
    return (
        <>
            <div style={{maxWidth:"100rem", width: "100%", margin:"2rem auto"}}>
                <h1 style={{marginBottom: "1rem"}}>Min sida</h1>
                <h2>Inloggad, {user?.username ? user.username : ""}</h2>
            </div>

            <div>
                <h3>Mina recensioner</h3>
                

            </div>
        </>
    )
}

export default MyPage