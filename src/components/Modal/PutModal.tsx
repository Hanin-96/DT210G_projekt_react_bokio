import { useState } from "react";
import { PutReview } from "../../types/review.types";
import { Star, ThumbsDown, ThumbsUp, X } from "lucide-react";
import ModalStyle from "../Modal/ModalStyle.module.css";


function PutModal({ putReview, onCloseProp, bookTitleProp }: { putReview: PutReview, onCloseProp: (updatedReview: PutReview) => void, bookTitleProp: string }) {

    const [formData, setFormData] = useState<PutReview>(putReview)

    //Error state
    const [error, setError] = useState("");

    //Loading
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setLoadingSpinner(true);
        event.preventDefault();
        setError('');

        //console.log("LoadingSpinner:", loadingSpinner)
        //Input fälten är antingen tomma eller ifyllda
        onCloseProp({
            _id : formData._id,
            reviewText: formData.reviewText,
            rating: formData.rating,
            pagesRead: formData.pagesRead,
            status: formData.status,
            recommend: formData.recommend,
            userId: formData.userId,
            bookId: formData.bookId
        });

        console.log("formdata:", formData);
    }
    return (
        <>

            <div className={ModalStyle.pageBody}>
                <div className={ModalStyle.textBoxStyle}>
                    <button className={ModalStyle.btnCancel} onClick={() => onCloseProp({
                        reviewText: "", rating: 1, pagesRead: 0, status: "", recommend: false,
                        _id: formData._id,
                        userId: "",
                        bookId: ""
                    })} style={{ background: "none", color: "#1e1e1e" }}><X /></button>
                    <h1 style={{ marginBottom: "1rem" }}>Ändra recension <span style={{ display: "block", textAlign: "center", width: "100%", margin: "0", maxWidth: "40rem", fontStyle: "italic" }}>{bookTitleProp}</span></h1>

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
                                value={formData.pagesRead ?? ''}
                                onChange={(event) => setFormData({ ...formData, pagesRead: Number(event.target.value) })} />
                        </div>

                        <div className={ModalStyle.formBox}>
                            <label htmlFor="status">Status:</label>
                            <select name="status" id="status" required
                                style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
                                value={formData.status}
                                onChange={(event) => setFormData({ ...formData, status: event.target.value })}>
                                <option value="Läser just nu">Läser just nu</option>
                                <option value="Läst klart">Läst klart</option>
                            </select>
                        </div>

                        <div style={{ marginTop: "2rem" }} className={ModalStyle.formRecommend}>
                            <label htmlFor="pagesRead">Rekommendation:</label>
                            <div className={ModalStyle.recommendWrap}>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <input type="radio" name="recommend" id="recommend" value={"true"}
                                        checked={formData.recommend === true}
                                        onChange={() => setFormData({ ...formData, recommend: true })} />
                                    <label htmlFor="recommend"><ThumbsUp />Tummen up</label>
                                </div>

                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <input type="radio" name="recommend" id="notRecommend" value={"false"}
                                        checked={formData.recommend === false}
                                        onChange={() => setFormData({ ...formData, recommend: false })} />
                                    <label htmlFor="notRecommend"><ThumbsDown />Tummen ner</label>
                                </div>
                            </div>
                        </div>


                        {
                            error && <p style={{ fontSize: "1.5rem", color: "red" }}>{error}</p>
                        }
                        <div className={ModalStyle.modalBtn}>
                            <button onClick={() => onCloseProp({
                               reviewText: formData.reviewText,
                               rating: formData.rating,
                               pagesRead: formData.pagesRead,
                               status: formData.status,
                               recommend: formData.recommend,
                               _id: formData._id,
                               userId: formData.userId,
                               bookId: formData.bookId
                            })}>Ångra</button>
                            <button type="submit">Uppdatera</button>
                        </div>
                    </form>
                    {loadingSpinner && <div className={ModalStyle.loadingSpinner}></div>}

                </div >
            </div >

        </>
    )
}


export default PutModal