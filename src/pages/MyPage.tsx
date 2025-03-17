import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import { Review } from "../types/review.types";
import { Heart, ThumbsDown, ThumbsUp } from "lucide-react";


function MyPage() {
    //States
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    //Context
    const { user } = useAuth();
    const { reviews, bookTitles, getReviewsById } = useReview();

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
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4rem", justifyContent: "left", marginTop: "4rem"}}>

                    {
                        reviews && reviews?.length > 0 ? (
                            reviews.map((review: Review, index: number) => (
                                <article key={review._id} style={{ maxWidth: "30rem", width: "100%", ...articleStyle}}>
                                    <h3>{bookTitles ? bookTitles[index] || "Titel finns inte" : "Titel finns inte"}</h3>
                                    <p>{review.reviewText}</p>
                                    <p>Lästa sidor: {review.pagesRead}</p>
                                    <p>Betyg: {review.rating}</p>
                                    <p>Rekommendation: {review.recommend ? <ThumbsUp /> : <ThumbsDown />}</p>
                                    <p>Likes: {review.like} <Heart /></p>
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