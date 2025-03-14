import { useState } from "react"
import { useReview } from "../context/ReviewContext";
import { Search } from "lucide-react";
import HomeStyle from "../pages/HomeStyle.module.css";
import { Book } from "../types/review.types";
import bookImg from "../assets/bookImg.png";

function HomePage() {

  const [search, setSearch] = useState("");
  //Hämta context för reviews
  const { books, getBooks } = useReview();

  const [error, setError] = useState("");

  const bookArticle: object = {
    display: "flex",
    justifyContent: "flex-start",
    maxWidth: "100rem",
    width: "100%",
    gap: "2rem",
    flexWrap: "wrap",
    margin: "0 auto"
  }

  return (
    <>
      <div style={{ margin: "4rem auto 4rem auto", maxWidth: "40rem", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="text"
            id="searchBar"
            placeholder="Sök efter boktitel"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "40rem", width: "100%", padding: "0.8rem", borderRadius: "0.5rem", border: "none" }}
          />
          <button className={HomeStyle.btnSearch} onClick={() => getBooks(search)}><Search style={{ color: "#1e1e1e" }} /></button>
        </div>
      </div>

      <div style={bookArticle}>
        {
          books && books.length > 0 ? (
            books.map((book:Book, index) => (
              <article style={{maxWidth: "15rem", width:"100%"}} key={book.id || `${book.title}-${index}`}>
                <h3 style={{wordWrap:"break-word", overflowWrap: "break-word", whiteSpace: "normal"}}>{book.title}</h3>
                <p>{book.authors}</p>
                <img src={book.thumbnail === "Bild är inte tillgänglig" ? bookImg : book.thumbnail } alt={book.title} style={{maxWidth: "15rem", width: "100%", height: "100%", display: "block", maxHeight:"20rem",objectFit: "cover"}} />

              </article>
            ))
          ) :
          <p>{error}</p>
        }
      </div>


    </>
  )
}

export default HomePage