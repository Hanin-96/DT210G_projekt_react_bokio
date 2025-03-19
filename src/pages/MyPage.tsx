import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import { Review } from "../types/review.types";
import { Heart, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import MyPageStyle from "../pages/MypageStyle.module.css";
import DeleteModal from "../components/Modal/DeleteModal";
import { Link } from "react-router-dom";


function MyPage() {
    //States
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    //Modal state för delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    //Context
    const { user } = useAuth();
    const { reviews, bookTitles, getReviewsById, deleteReview } = useReview();

    useEffect(() => {
        const getAllReviews = async () => {
            try {
                console.log("Startar laddning av recensioner...");
                setLoading(true);
                if (user) {
                    await getReviewsById(user._id);
                }
                setLoading(false);
                console.log("Recensioner har laddats.");

                console.log("Reviews:", reviews);
            } catch (error) {
                setLoading(false);
                setError("Det gick inte att hämta recensioner");
            }
        };
        getAllReviews();
    }, []);

    const articleStyle: object = {
        maxWidth: "30rem",
        width: "100%",
        marginBottom: "2rem",
        backgroundColor: "rgb(248, 245, 242)",
        color: "rgb(30, 30, 30)",
        padding: "1rem",
        borderRadius: "1rem",
        fontSize: "1.6rem",
        boxShadow: "rgb(255, 136, 45) 5px 5px 0px 0px"
    }
    return (
        <>
            <div style={{ maxWidth: "100rem", width: "100%", margin: "2rem auto" }}>
                <h1 style={{ marginBottom: "1rem" }}>Min sida</h1>
                <h2>Inloggad, {user?.username ? user.username : ""}</h2>
            </div>

            <div style={{ maxWidth: "100rem", width: "100%", margin: "0 auto" }}>
                <h3>Mina recensioner</h3>

                {
                    loading && <p style={{ color: "white", margin: "2rem auto 2rem auto" }}>Laddar in recensioner...</p>
                }
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4rem", justifyContent: "left", marginTop: "4rem" }}>

                    {
                        reviews && reviews?.length > 0 ? (
                            reviews.map((review: Review, index: number) => (
                                <article key={review._id} style={{ maxWidth: "30rem", width: "100%", opacity: loading ? 0 : 1, ...articleStyle }} className={MyPageStyle.articleReviews}>
                                    <h4>{bookTitles ? bookTitles[index] || "Titel finns inte" : "Titel finns inte"}</h4>
                                    <p>{review.reviewText}</p>
                                    <p>Lästa sidor: {review.pagesRead}</p>
                                    <p> {[1, 2, 3, 4, 5].map((starValue) => (
                                        <Star key={starValue} fill={review.rating >= starValue ? "#FF882D" : "none"} stroke="#1e1e1e" />
                                    ))}</p>
                                    <p>Rekommendation: {review.recommend ? <ThumbsUp /> : <ThumbsDown />}</p>
                                    <p>Likes: {review.like} <Heart /></p>

                                    <div>

                                        <Link to={`/book/${review.bookId}`}>Se bok</Link>
                                        <button>Uppdatera</button>
                                        <button onClick={() => setShowDeleteModal(true)}>Ta bort</button>
                                        {showDeleteModal && <DeleteModal onCloseProp={
                                            //Om användare klickar på ta bort i modalen då blir confirmDelete true
                                            (confirmDelete: boolean) => {
                                                if (confirmDelete && user) {
                                                    //Delete funktion ska kallas här
                                                    deleteReview(review._id, user?._id)
                                                }
                                                setShowDeleteModal(false)
                                            }
                                        } />}
                                    </div>
                                </article>
                            ))
                        ) :
                            <p>{error}</p>
                    }
                </div>



            </div>
        </>
    )
}

export default MyPage