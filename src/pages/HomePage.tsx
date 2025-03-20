import { useEffect, useState } from "react"
import { Search } from "lucide-react";
import HomeStyle from "../pages/HomeStyle.module.css";
import ModalStyle from "../components/Modal/ModalStyle.module.css";
import { Book } from "../types/book.types";
import bookImg from "../assets/bookImg.png";
import bookImgLarge from "../assets/bookImgLarge.png";
import { Link } from 'react-router-dom';
import { useBook } from "../context/BookContext";

function HomePage() {

  const [search, setSearch] = useState("");

  const [searchQuery, setSearchQuery] = useState(false);
  const [error, setError] = useState("");
  //Loading
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  //Hämta context för reviews
  const { books, getBooks } = useBook();

  const bookArticle: object = {
    display: "flex",
    justifyContent: "flex-start",
    maxWidth: "100rem",
    width: "100%",
    gap: "6rem",
    flexWrap: "wrap",
    margin: "0 auto"
  }

  const bookLinks: object = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    maxHeight: "50rem",
    height: "100%",
    color: "white",
    textDecoration: "none"
  }

  useEffect(() => {

    if (books && books.length === 0 && searchQuery) {
      setError("Det finns inga böcker under den titel");
    } else {
      setError("");
    }

    setLoadingSpinner(false);
  }, [books, searchQuery]);


  const handleSearch = async (search: string) => {

    setLoadingSpinner(true);
    setError("");

    try {
      await getBooks(search);
      setSearchQuery(true);
    } catch (error) {
      setError("Det gick inte att hämta böcker");
    }
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
          <button className={HomeStyle.btnSearch} onClick={() => handleSearch(search)}><Search style={{ color: "#1e1e1e" }} /></button>
        </div>
      </div>

      {loadingSpinner && <div className={ModalStyle.loadingSpinnerHome}></div>}


      {
        !searchQuery &&
        <div style={{ textAlign: "center",maxWidth:"20rem", width:"100%", margin: "10rem auto 20rem auto" }}>
          <img src={bookImgLarge} className={HomeStyle.bookHomepage} alt="Bokio" style={{maxWidth:"20rem", width:"100%", textAlign:"center"}} />
        </div>
      }


      <div style={bookArticle}>
        {
          books && books.length > 0 ? (
            books.map((book: Book) => (
              <article style={{ maxWidth: "15rem", width: "100%" }} key={book.id}>
                <Link to={`/book/${book.id}`} style={bookLinks}>
                  <h4 style={{ wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "normal" }}>{book.title}</h4>
                  <p>{book.authors}</p>
                  <img src={book.thumbnail === "" ? bookImg : book.thumbnail} alt={book.title} style={{ maxWidth: "15rem", width: "100%", height: "100%", display: "block", maxHeight: "20rem", objectFit: "cover" }} />
                </Link>
              </article>
            ))
          ) :
            <p style={{ textAlign: "center", width: "100%" }}>{error}</p>
        }
      </div>


    </>
  )
}

export default HomePage