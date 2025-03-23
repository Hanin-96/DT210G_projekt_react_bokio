import { ChevronRight, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Review } from "../types/review.types";
import { BookTitleImage } from "../types/book.types";
import BookPageStyle from "../pages/BookPageStyle.module.css";


function HomeReviews({ homePageReviewProp, bookTitleImgProp }: { homePageReviewProp: Review, bookTitleImgProp: BookTitleImage }) {


  const articleReview: object = {
    maxWidth: "22rem",
    width: "100%",
    marginBottom: "2rem",
    backgroundColor: "#F8F5F2",
    color: "#1e1e1e",
    padding: "1rem",
    borderRadius: "1rem",
    fontSize: "1.6rem",
    boxShadow: "5px 5px 0px 0px #FF882D",
    height: "30rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }
  return (
    <>
      <article key={homePageReviewProp._id} style={{ ...articleReview }}>
        <h4>{bookTitleImgProp.title ? bookTitleImgProp.title : "Titel finns inte"}</h4>

        <div style={{
          width: "100%",
          overflowY: "scroll",
          maxHeight: "8rem",
          height: "100%"
        }}>
          <p>{homePageReviewProp.reviewText}</p>
        </div>
        <p> {[1, 2, 3, 4, 5].map((starValue) => (
          <Star key={starValue} fill={homePageReviewProp.rating >= starValue ? "#FF882D" : "none"} stroke="#1e1e1e" />
        ))}</p>
        <p style={{ display: "flex", alignItems: "center" }}>Rekommendation: {homePageReviewProp.recommend ? <ThumbsUp /> : <ThumbsDown />}</p>

        <Link to={`/book/${homePageReviewProp.bookId}`} className={BookPageStyle.btnBookLink}>Se bok <ChevronRight className={BookPageStyle.chevron} /></Link>
      </article>

    </>
  )
}

export default HomeReviews