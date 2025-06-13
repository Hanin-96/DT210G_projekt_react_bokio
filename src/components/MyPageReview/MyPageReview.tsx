import { Review, PutReview } from "../../types/review.types";
import MyPageReviewStyle from "../MyPageReview/MypageReviewStyle.module.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useReview } from "../../context/ReviewContext";
import { ChevronRight, CircleX, Heart, Pencil, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import PutModal from "../Modal/PutModal";
import DeleteModal from "../Modal/DeleteModal";
import { BookTitleImage } from "../../types/book.types";
import BookPageStyle from "../../pages/BookPage/BookPageStyle.module.css";



function MyPageReview({ myPageReviewProp, bookTitleImgProp }: { myPageReviewProp: Review, bookTitleImgProp: BookTitleImage }) {

    //Modal state för delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    //Modal state för uppdatera
    const [showPutModal, setShowPutModal] = useState(false);

    //Context
    const { user } = useAuth();
    const { deleteReview, updateReview } = useReview();

    //loading state
    const [loading, setLoading] = useState(false);

    const articleStyle: object = {
        maxWidth: "30rem",
        width: "100%",
        marginBottom: "2rem",
        backgroundColor: "rgb(248, 245, 242)",
        color: "rgb(30, 30, 30)",
        padding: "1rem",
        borderRadius: "1rem",
        fontSize: "1.6rem",
        boxShadow: "rgb(255, 136, 45) 5px 5px 0px 0px",
        display: "flex",
        flexDirection: "column"
    }
    return (
        <>

            <article key={myPageReviewProp._id} style={{ opacity: loading ? 0 : 1, ...articleStyle }} className={MyPageReviewStyle.articleReviews}>
                <h4>{bookTitleImgProp.title ? bookTitleImgProp.title : "Titel finns inte"}</h4>
                <div style={{ textAlign: "center" }}>
                            <img src={bookTitleImgProp.thumbnail} alt={bookTitleImgProp.title} style={{ maxWidth: "10rem", width: "100%" }} />
                        </div>
                <div style={{
                    width: "100%",
                    overflowY: "scroll",
                    maxHeight: "10rem",
                    height: "100%",
                    marginTop: "2rem",
                    marginBottom: "1rem"
                }}>
                    <p>{myPageReviewProp.reviewText}</p>
                </div>

                <p> {[1, 2, 3, 4, 5].map((starValue) => (
                    <Star key={starValue} fill={myPageReviewProp.rating >= starValue ? "#FF882D" : "none"} stroke="#1e1e1e" />
                ))}</p>
                <p style={{ display: "flex", alignItems: "center" }}>Rekommendation: {myPageReviewProp.recommend ? <ThumbsUp /> : <ThumbsDown />}</p>

                <p>{myPageReviewProp.like.length || 0} <Heart /></p>

                <div style={{ marginTop: "1.5rem" }}>

                    <Link to={`/book/${myPageReviewProp.bookId}`} className={BookPageStyle.btnBookLink}>Se bok <ChevronRight className={BookPageStyle.chevron} /></Link>

                    <button onClick={() => setShowPutModal(true)} className={BookPageStyle.btnUpdate}>Ändra <Pencil stroke="#1e1e1e" className={BookPageStyle.pencil} /></button>
                    {showPutModal &&

                        <PutModal putReview={{ reviewText: myPageReviewProp.reviewText, rating: myPageReviewProp.rating, status: myPageReviewProp.status, recommend: myPageReviewProp.recommend, userId: myPageReviewProp.userId._id, bookId: myPageReviewProp.bookId }}

                            onCloseProp={async (updatedReview: PutReview) => {
                                if (updatedReview && updatedReview.bookId != "" && user) {
                                    await updateReview(myPageReviewProp._id, user?._id, updatedReview, true);
                                    setLoading(false);
                                }
                                setShowPutModal(false);

                            }} bookTitleImgProp={bookTitleImgProp}
                        />}



                    <button onClick={() => setShowDeleteModal(true)} className={BookPageStyle.btnBookDelete}>Ta bort <CircleX className={BookPageStyle.circleX} /></button>
                    {showDeleteModal && <DeleteModal onCloseProp={
                        //Om användare klickar på ta bort i modalen då blir confirmDelete true
                        (confirmDelete: boolean) => {
                            if (confirmDelete && user) {
                                //Delete funktion ska kallas här
                                deleteReview(myPageReviewProp._id, user?._id, "")
                            }
                            setShowDeleteModal(false)
                        }
                    } />}
                </div>
            </article >

        </>
    )
}

export default MyPageReview