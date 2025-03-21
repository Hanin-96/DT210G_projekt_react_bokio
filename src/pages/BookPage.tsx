import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useReview } from "../context/ReviewContext";
import { PostReview, PutReview, Review } from "../types/review.types";
import { Heart, SquarePen, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import bookImg from "../assets/bookImg.png";
import BookPageStyle from "../pages/BookPageStyle.module.css";
import { useAuth } from "../context/AuthContext";
import PostModal from "../components/Modal/PostModal";
import PutModal from "../components/Modal/PutModal";
import { useBook } from "../context/BookContext";


function BookPage() {
  //States
  const [error, setError] = useState("Det finns inga recensioner");
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPutModal, setShowPutModal] = useState(false);


  //Context
  const { reviews, getReviewsByBook, postReview, updateReview, bookTitleImageList } = useReview();
  const { oneBook, getBookById } = useBook();

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
  }, []);

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
              reviews && !reviews.some((review: Review) => review.userId._id === user._id)
                ?
                (
                  <div>
                    <button type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center" }} className={BookPageStyle.btnReview} onClick={() => setShowModal(true)}>Skriv recension <SquarePen style={{ marginLeft: "0.5rem" }} /></button>
                    {showModal && <PostModal onCloseProp={async (newReview: PostReview) => {
                      if (newReview && newReview.bookId != "" && user?._id) {

                        await postReview(newReview);
                      }

                      setShowModal(false);
                    }} />}
                  </div>
                ) :

                <div></div>

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
                oneBook && reviews && reviews.length > 0 ? (
                  reviews.map((review: Review) => (
                    <article key={review._id} style={reviewStyle}>
                      <h4>{review.userId.username}</h4>
                      <p>{review.reviewText}</p>
                      <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <Star key={starValue} fill={review.rating >= starValue ? "#FF882D" : "none"} stroke="#1e1e1e" />
                        ))}
                      </div>
                      <p>Rekommendation: {review.recommend ? <ThumbsUp /> : <ThumbsDown />}</p>
                      <p>Likes: {review.like} <Heart /></p>

                      {
                        review.userId._id == user?._id &&
                        <div>
                          <button onClick={() => setShowPutModal(true)}>Ändra</button>
                          {showPutModal && <PutModal putReview={{ reviewText: review.reviewText, rating: review.rating, status: review.status, recommend: review.recommend, userId: review.userId._id, bookId: review.bookId }}
                            bookTitleImgProp={
                              bookTitleImageList?.find(bookTitleImage => bookTitleImage.bookId === review.bookId) || { bookId: '', title: '', thumbnail: ''}
                            }
                            onCloseProp={async (updatedReview: PutReview) => {
                              if (updatedReview && updatedReview.bookId != "" && user) {
                                await updateReview(review._id, user?._id, updatedReview, false);
                              }
                              setShowPutModal(false);

                            }}
                          />}
                        </div>
                      }


                    </article>
                  ))
                ) : (
                  <p>{error}</p>
                )
              }
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default BookPage