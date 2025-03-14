import { useEffect, useState } from "react";
import { useReview } from "../context/ReviewContext";
import { Review } from "../types/review.types";
import { Heart, ThumbsDown, ThumbsUp } from "lucide-react";


function ReviewPage() {
     const [reviewsLoaded, setReviewsLoaded] = useState(false);
      const [error, setError] = useState("");
    
      //Hämta context för reviews
      const { reviews, getReviews } = useReview();
    
      //UseEffect för att hämta in reviews
      useEffect(() => {
        const getAllReviews = async () => {
          try {
            //Hämtar reviews data från context
            await getReviews();
            setReviewsLoaded(true)
    
          } catch (error) {
            setError("Det gick inte att hämta recensioner")
    
          }
        };
        getAllReviews();
      }, []);
  return (
    <>
     <div style={{ opacity: reviewsLoaded ? 1 : 0, maxWidth: "100rem", width: "100%", margin: "0 auto" }}>
        {
          reviews && reviews.length > 0 ? (
            reviews.map((review: Review) => (
              <article key={review._id} style={{ maxWidth: "40rem", width: "100%", marginBottom: "2rem", backgroundColor: "#F8F5F2", color: "#1e1e1e", padding: "1rem", borderRadius: "1rem", fontSize: "1.6rem", boxShadow: "5px 5px 0px 0px #FF882D" }}>
                <p>{review.bookId}</p>
                <p>{review.bookId}</p>
                <p>{review.reviewText}</p>
                <p>Lässtatus:<span style={{ display: "block" }}>{review.status}</span></p>
                <p>{review.pagesRead}</p>
                <p>{review.recommend ? <ThumbsUp /> : <ThumbsDown />}</p>
                <p>Betyg(1-5):<span style={{ display: "block", backgroundColor: "#1e1e1e", color: "white", padding: "0.5rem 1rem", maxWidth: "fit-content", borderRadius: "100%" }}>{review.rating}</span></p>
                <p>{review.userId.username}</p>
                <p>{review.like} <Heart /></p>
              </article>
            ))
          ) :
            <p>{error}</p>
        }
      </div>
    </>
  )
}

export default ReviewPage