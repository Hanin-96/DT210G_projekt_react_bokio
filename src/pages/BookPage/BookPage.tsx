import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { useReview } from "../../context/ReviewContext";
import { PostReview, PutReview, Review } from "../../types/review.types";
import { CircleX, Heart, Pencil, SquarePen, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import bookImg from "../../assets/bookImg.png";
import BookPageStyle from "../BookPage/BookPageStyle.module.css";
import { useAuth } from "../../context/AuthContext";
import PostModal from "../../components/Modal/PostModal";
import PutModal from "../../components/Modal/PutModal";
import DeleteModal from "../../components/Modal/DeleteModal";
import { useBook } from "../../context/BookContext";


function BookPage() {
  //States
  const [error, setError] = useState("Det finns inga recensioner");
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  //Modaler
  const [showModal, setShowModal] = useState(false);
  const [showPutModal, setShowPutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  //Context
  const { reviews, getReviewsByBook, postReview, updateReview, deleteReview, bookTitleImageList, likeReview } = useReview();
  const { oneBook, getBookById } = useBook();

  const { user } = useAuth();

  //Hämtar bookId från url
  const { bookId } = useParams();
  //console.log("bookId:", bookId);

  useEffect(() => {
    const getAllReviews = async () => {
      try {
        //console.log("Startar laddning av recensioner...");
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

  const checkIfUserLike = (review: Review): boolean => {
    if (user && review) {

      if (review.like.length > 0) {
        const userLikes = review.like.includes(user._id);
        //console.log("userLikes:", userLikes)
        return userLikes;
      }

    }
    return false;

  }



  const reviewStyle: object = {
    maxWidth: "40rem",
    width: "100%",
    marginBottom: "2rem",
    backgroundColor: "#F8F5F2",
    color: "#1e1e1e",
    padding: "1rem",
    borderRadius: "1rem",
    fontSize: "1.6rem",
    boxShadow: "5px 5px 0px 0px #FF882D",
    lineHeight: "200%"
  }
  return (
    <>
      <div className="bookReviewContainer" style={{ maxWidth: "60rem", width: "100%", margin: "2rem auto" }}>

        {
          loadingBook && <p style={{ color: "white", width: "100%", margin: "2rem auto 2rem auto" }}>Laddar in boken...</p>
        }

        {isLoaded &&
          <div style={{ marginBottom: "5rem", opacity: loadingBook ? 0 : 1 }}>
            {
              oneBook ? (
                <div style={{ margin: "0 auto" }}>
                  <h1>{oneBook.title}</h1>
                  <p style={{ margin: "1rem 0 1rem 0", fontStyle: "italic" }}>{Array.isArray(oneBook?.authors) && oneBook.authors.length > 0
                    ? oneBook.authors.join(", ")
                    : "Okänd författare"}</p>

                  <article style={{ maxWidth: "60rem", width: "100%" }}>
                    <div style={{ display: "flex", gap: "5rem", alignItems: "center" }} className={BookPageStyle.bookArticle}>
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
                    {showModal && <PostModal bookTitleImgProp={bookTitleImageList?.find(bookTitleImage => bookTitleImage.bookId === bookId) || { bookId: '', title: '', thumbnail: '' }} onCloseProp={async (newReview: PostReview) => {
                      if (newReview && newReview.bookId != "" && user?._id) {

                        postReview(newReview);
                      }

                      setShowModal(false);
                    }} />}
                  </div>
                )
                : null
            : null
          }

          {isLoaded && !user && 

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
                      <div style={{ height: "100%", maxHeight: "20rem", overflowY: "scroll" }}>
                        <p>{review.reviewText}</p>
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <Star key={starValue} fill={review.rating >= starValue ? "#FF882D" : "none"} stroke="#1e1e1e" />
                        ))}
                      </div>
                      <p style={{ display: "flex", alignItems: "center" }}>Rekommendation: {review.recommend ? <ThumbsUp /> : <ThumbsDown />}</p>
                      {user && user._id ? (
                        <div>
                          <button style={{ display: "flex", flexDirection: "row", alignItems: "center", border: "none", boxShadow: "none", backgroundColor: "unset", cursor: "pointer" }} onClick={() => likeReview(!checkIfUserLike(review), review._id)}>{review.like.length > 0 ? review.like.length : ""} <Heart fill={checkIfUserLike(review) ? "#FF882D" : "none"} /></button>
                        </div>
                      ) : (
                        <p style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>{review.like.length || 0} <Heart /></p>
                      )
                      }
                      <p style={{ fontSize: "1.4rem" }}>{new Date(review.created).toLocaleString()}</p>

                      {
                        review.userId._id == user?._id &&
                        <div>
                          <button onClick={() => setShowPutModal(true)} className={BookPageStyle.btnUpdate}>Ändra  <Pencil stroke="#1e1e1e" className={BookPageStyle.pencil} /></button>
                          {showPutModal && <PutModal putReview={{ reviewText: review.reviewText, rating: review.rating, status: review.status, recommend: review.recommend, userId: review.userId._id, bookId: review.bookId }}
                            bookTitleImgProp={
                              bookTitleImageList?.find(bookTitleImage => bookTitleImage.bookId === review.bookId) || { bookId: '', title: '', thumbnail: '' }
                            }
                            onCloseProp={async (updatedReview: PutReview) => {
                              if (updatedReview && updatedReview.bookId != "" && user) {
                                await updateReview(review._id, user?._id, updatedReview, false);
                              }
                              setShowPutModal(false);

                            }}
                          />}

                          <button onClick={() => setShowDeleteModal(true)} className={BookPageStyle.btnBookDelete}>Ta bort <CircleX className={BookPageStyle.circleX} /></button>
                          {showDeleteModal && <DeleteModal
                            onCloseProp={
                              //Om användare klickar på ta bort i modalen då blir confirmDelete true
                              (confirmDelete: boolean) => {
                                if (confirmDelete && user && bookId) {
                                  //Delete funktion ska kallas här
                                  deleteReview(review._id, "", bookId)

                                }
                                setShowDeleteModal(false)


                              }
                            } />}
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