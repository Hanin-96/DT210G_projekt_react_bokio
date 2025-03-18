import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useReview } from "../context/ReviewContext";
import { PostReview, Review } from "../types/review.types";
import { Heart, SquarePen, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import bookImg from "../assets/bookImg.png";
import BookPageStyle from "../pages/BookPageStyle.module.css";
import { useAuth } from "../context/AuthContext";
import PostModal from "../components/Modal/PostModal";


function BookPage() {
  //States
  const [error, setError] = useState("");
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  //Context
  const { reviews, oneBook, getReviewsByBook, getBookById, postReview } = useReview();
  const { user } = useAuth();

  //Hämtar bookId från url
  const { bookId } = useParams();
  console.log("bookId:", bookId);

  useEffect(() => {
    const getAllReviews = async () => {
      try {
        console.log("Startar laddning av recensioner...");
        setLoadingReviews(true);
        if (bookId) {
          await getBookById(bookId);
          await getReviewsByBook(bookId);

        }
        setLoadingBook(false);
        setLoadingReviews(false);
        setIsLoaded(true);

      } catch (error) {
        setLoadingBook(false);
        setLoadingReviews(false);
        setError("Det gick inte att hämta recensioner");
      }
    };
    getAllReviews();
  }, [bookId]);

  const reviewStyle: object = {
    maxWidth: "40rem", width: "100%", marginBottom: "2rem", backgroundColor: "#F8F5F2", color: "#1e1e1e", padding: "1rem", borderRadius: "1rem", fontSize: "1.6rem", boxShadow: "5px 5px 0px 0px #FF882D"
  }
  return (
    <>
      <div className="bookReviewContainer" style={{ maxWidth: "60rem", width: "100%", margin: "2rem auto" }}>

        {
          loadingBook && <p style={{ color: "white", maxWidth: "60rem", width: "100%", margin: "2rem auto 2rem auto" }}>Laddar in boken...</p>
        }

        {isLoaded &&
          <div style={{ marginBottom: "5rem", opacity: loadingBook ? 0 : 1 }}>
            {
              oneBook ? (
                <div style={{ margin: "0 auto" }}>
                  <h1>{oneBook.title}</h1>

                  <article style={{ maxWidth: "50rem", width: "100%" }}>
                    <div style={{ display: "flex", gap: "5rem", alignItems: "center" }}>
                      <p dangerouslySetInnerHTML={{ __html: oneBook.description }} />
                      <img src={oneBook?.thumbnail || bookImg} alt={oneBook.title} style={{ maxWidth: "15rem", width: "100%", height: "100%", display: "block", maxHeight: "20rem", objectFit: "cover", margin: "1rem auto 0 auto" }} />
                    </div>
                  </article>
                </div>
              ) : (
                <p>{error}</p>
              )
            }
          </div>
        }

        <div>
          {
            user ?
              <div>
                <button type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className={BookPageStyle.btnReview} onClick={() => setShowModal(true)}>Skriv recension <SquarePen style={{ marginLeft: "0.5rem" }} /></button>
                {showModal && <PostModal onCloseProp={async (newReview: PostReview) => {
                  if (newReview && user?._id) {
                    console.log("newReview:", newReview);
                    await postReview(newReview);
                  }
                  setShowModal(false);
                }} />}
              </div>
              :
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className={BookPageStyle.btnReview}>Skriv recension <SquarePen style={{ marginLeft: "0.5rem" }} /></button>
              </Link>
          }


          {
            loadingReviews && <p style={{ color: "white", maxWidth: "60rem", width: "100%", margin: "2rem auto 2rem auto" }}>Laddar in recensioner...</p>
          }

          {isLoaded &&
            <div style={{ maxWidth: "60rem", width: "100%", margin: "0 auto" }} className={BookPageStyle.reviewArticle}>
              {
                reviews && reviews.length > 0 ? (
                  reviews.map((review: Review) => (
                    <article key={review._id} style={reviewStyle}>
                      <h4>{review.userId.username}</h4>
                      <p>{review.reviewText}</p>
                      <p>Lästa sidor: {review.pagesRead}</p>
                      <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <Star key={starValue} fill={review.rating >= starValue ? "#FF882D" : "none"} stroke="#1e1e1e" />
                        ))}
                      </div>
                      <p>Rekommendation: {review.recommend ? <ThumbsUp /> : <ThumbsDown />}</p>
                      <p>Likes: {review.like} <Heart /></p>
                    </article>
                  ))
                ) :
                  <p>{error}</p>
              }
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default BookPage