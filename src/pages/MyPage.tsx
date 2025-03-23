import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import { Review } from "../types/review.types";
import MyPageReview from "../components/MyPageReview/MyPageReview";


function MyPage() {
    //States
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    //Context
    const { user } = useAuth();
    const { reviews, getReviewsById, bookTitleImageList } = useReview();

    useEffect(() => {
        const getAllReviews = async () => {
            try {
                setLoading(true);
                if (user) {
                    await getReviewsById(user._id);
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError("Det gick inte att hämta recensioner");
            }
        };
        getAllReviews();
    }, [user]);


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
                {!loading && <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "4rem", justifyContent: "left", marginTop: "4rem" }}>

                    {
                        reviews && reviews?.length > 0 ? (
                            reviews.map((review: Review) => (
                                <MyPageReview
                                    myPageReviewProp={review}
                                    key={review._id}
                                    bookTitleImgProp={
                                        bookTitleImageList?.find(bookTitleImage => bookTitleImage.bookId === review.bookId) || { bookId: '', title: '', thumbnail: '' }
                                    }></MyPageReview>
                            ))
                        ) :
                            <p>{error}</p>
                    }
                </div>
                }



            </div>
        </>
    )
}

export default MyPage