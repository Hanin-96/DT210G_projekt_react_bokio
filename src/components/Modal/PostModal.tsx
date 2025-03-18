import { useState } from "react"
import { PostReview } from "../../types/review.types"
import { useAuth } from "../../context/AuthContext";
import { useReview } from "../../context/ReviewContext";
import { Star, ThumbsDown, ThumbsUp, X } from "lucide-react";
import ModalStyle from "../Modal/ModalStyle.module.css";


function PostModal({ onCloseProp }: { onCloseProp: (newReview: PostReview) => void }) {
    const { user } = useAuth();
    const { oneBook } = useReview();

    const [formData, setFormData] = useState<PostReview>({ reviewText: "", rating: 1, pagesRead: null, status: "Läser just nu", recommend: false, userId: user?._id || "", bookId: oneBook?.id || "" })

    //Error state
    const [error, setError] = useState("");

    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');


        //Input fälten är antingen tomma eller ifyllda
        onCloseProp({ reviewText: formData.reviewText, rating: formData.rating, pagesRead: formData.pagesRead, status: formData.status, recommend: formData.recommend, userId: formData.userId, bookId: formData.bookId });

    }
    return (
        <>

            <div className={ModalStyle.pageBody}>
                <div className={ModalStyle.textBoxStyle}>
                    <button className={ModalStyle.btnCancel} onClick={() => onCloseProp({ reviewText: "", rating: 1, pagesRead: 1, status: "", recommend: false, userId: user?._id || "", bookId: oneBook?.id || "" })} style={{ background: "none", color: "#1e1e1e" }}><X /></button>
                    <h1 style={{ marginBottom: "1rem" }}>Ny recension</h1>

                    <form onSubmit={handleOnSubmit}>
                        <div className={ModalStyle.formBox}>
                            <label htmlFor="title">Recension:</label>
                            <textarea
                                required
                                value={formData.reviewText}
                                onChange={(event) => setFormData({ ...formData, reviewText: event.target.value })}></textarea>
                        </div>

                        <div className={ModalStyle.formBox}>
                            <label htmlFor="rating">Betyg 1-5:</label>
                            <div style={{ display: "flex", gap: "5px" }}>
                                {[1, 2, 3, 4, 5].map((starValue: any) => (
                                    <div key={starValue} style={{ position: "relative" }}>
                                        <input
                                            type="radio"
                                            id={`st-${starValue}`}
                                            value={starValue}
                                            name="star-radio"
                                            onChange={(event) => setFormData({ ...formData, rating: Number(event.target.value) })}
                                            style={{ position: "absolute", opacity: 0, width: "100%", height: "100%" }} 
                                        />
                                        <label htmlFor={`st-${starValue}`} style={{ cursor: "pointer" }}>
                                            <Star fill={formData.rating >= starValue ? "#FF882D" : "transparent"} stroke="#1e1e1e" />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className={ModalStyle.formBox}>
                            <label htmlFor="pagesRead">Lästa sidor:</label>

                            <input type="number" name="pagesRead" id="pagesRead" required
                                value={formData.pagesRead}
                                onChange={(event) => setFormData({ ...formData, pagesRead: Number(event.target.value) })} />
                        </div>

                        <div className={ModalStyle.formBox}>
                            <label htmlFor="status">Status:</label>
                            <select name="status" id="status" required
                            style={{marginLeft:"0.5rem", padding: "0.5rem"}}
                                value={formData.status}
                                onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                                <option value="Läser just nu">Läser just nu</option>
                                <option value="Läst klart">Läst klart</option>
                            </select>
                        </div>

                        <div style={{ marginTop: "2rem" }} className={ModalStyle.formRecommend}>
                            <label htmlFor="pagesRead">Rekommendation:</label>
                            <div className={ModalStyle.recommendWrap}>
                                <div style={{display: "flex", gap:"0.5rem"}}>
                                    <input type="radio" name="recommend" id="recommend" value={"true"}
                                        checked={formData.recommend === true}
                                        onChange={(event) => setFormData({ ...formData, recommend: true })} />
                                    <label htmlFor="recommend"><ThumbsUp />Tummen up</label>
                                </div>

                                <div style={{display: "flex", gap:"0.5rem"}}>
                                    <input type="radio" name="recommend" id="notRecommend" value={"false"}
                                        checked={formData.recommend === false}
                                        onChange={(event) => setFormData({ ...formData, recommend: false })} />
                                    <label htmlFor="notRecommend"><ThumbsDown />Tummen ner</label>
                                </div>
                            </div>
                        </div>


                        {
                            error && <p style={{ fontSize: "1.5rem", color: "red" }}>{error}</p>
                        }
                        <div className={ModalStyle.modalBtn}>
                            <button onClick={() => onCloseProp({ reviewText: "", rating: 1, pagesRead: 1, status: "", recommend: false, userId: user?._id || "", bookId: oneBook?.id || "" })}>Ångra</button>
                            <button type="submit">Lägg till</button>
                        </div>
                    </form>
                </div >
            </div >

        </>
    )
}

export default PostModal