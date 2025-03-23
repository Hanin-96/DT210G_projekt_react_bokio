import { createContext, useState, useContext, ReactNode } from "react";
import { PostReview, PutReview, Review } from "../types/review.types";
import { ReviewContextType } from "../types/review.types";
import { BookTitleImage } from "../types/book.types";


const ReviewContext = createContext<ReviewContextType | null>(null);

interface ImagesProviderProps {
    children: ReactNode
}

export const ReviewProvider: React.FC<ImagesProviderProps> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    const [bookTitleImageList, setBookTitleImageList] = useState<BookTitleImage[]>([]);

    //Hämta alla reviews publikt
    const getReviews = async (): Promise<void> => {
        try {
            const response = await fetch("https://dt210g-bokio-api.onrender.com/reviews", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            if (response.ok) {
                const data = await response.json();
                console.log(data)

                //Sortera reviews efter senaste skapade
                const latestReviews = data.reviews.sort((a: Review, b: Review) => new Date(b.created).getTime() - new Date(a.created).getTime());

                setReviews(latestReviews);


                //Hämtar bookTitleLista med titel och thumbnail utifrån review lista
                const titleImageList = await getBookTitleImageList(data.reviews);

                // Uppdatera state med alla boktitlar
                setBookTitleImageList(titleImageList);

            } else {
                setReviews([]);
            }

        } catch (error) {
            console.error("Det gick inte att hämta recensionerna:", error);
            setReviews([]);
        }
    }

    //Hämta reviews utifrån userId
    const getReviewsById = async (userId: string): Promise<void> => {

        try {
            const response = await fetch(`https://dt210g-bokio-api.onrender.com/reviews/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            if (!response.ok) {
                setReviews([]);
                return;
            }

            const data = await response.json();
            console.log("Recensioner:", data);


            //Sortera reviews efter senaste skapade
            const latestReviews = data.reviewsByUserId.sort((a: Review, b: Review) => new Date(b.created).getTime() - new Date(a.created).getTime());

            setReviews(latestReviews);

            //Hämtar bookTitleLista med titel och thumbnail utifrån review lista
            const titleImageList = await getBookTitleImageList(data.reviewsByUserId);

            // Uppdatera state med alla boktitlar
            setBookTitleImageList(titleImageList);

        } catch (error) {
            console.error("Det gick inte att hämta recensioner", error);
            setReviews([]);
        }
    };

    //Hämta boktitlar
    async function getBookTitleImageList(reviewList: Review[]) {
        //Hämtar endast unika bookIds
        const bookIds = Array.from(new Set(reviewList.map((review: Review) => review.bookId)));

        console.log("Review bookIds:", bookIds);
        //Hämta boktitlar för varje bokId samtidigt, returnerar lista när alla anrop har gjorts
        const titlesImages = await Promise.all(bookIds.map(async (id: string) => {
            try {
                const bookResponse = await fetch(`https://dt210g-bokio-api.onrender.com/book/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (!bookResponse.ok) return { bookId: "", title: "", thumbnail: "" };

                const bookData = await bookResponse.json();
                const bookTitleImage = {
                    bookId: bookData.id,
                    title: bookData.title,
                    thumbnail: bookData.thumbnail
                }
                console.log("bookData:", bookTitleImage)
                return bookTitleImage;

            } catch (error) {
                console.error("Fel vid hämtning av bok:", error);
                return { bookId: "", title: "", thumbnail: "" };
            }
        }
        ));
        return titlesImages;
    }

    const getReviewsByBook = async (bookId: string): Promise<void> => {

        try {
            console.log("search:", bookId)
            const response = await fetch(`https://dt210g-bokio-api.onrender.com/reviews/book/${bookId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            if (response.ok) {
                const data = await response.json();
                console.log("getReviewsByBook:", data)
                setReviews(data.reviews);

                //Hämtar bookTitleLista med titel och thumbnail utifrån review lista
                const titleImageList = await getBookTitleImageList(data.reviews);

                // Uppdatera state med alla boktitlar
                setBookTitleImageList(titleImageList);

            } else {
                setReviews([]);
            }

        } catch (error) {
            console.error("Det gick inte att hämta recensioner", error);
            setReviews([]);
        }
    }

    const postReview = async (newReview: PostReview): Promise<void> => {
        try {
            const response = await fetch("https://dt210g-bokio-api.onrender.com/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newReview),
                credentials: "include"
            })

            if (response.ok) {
                console.log("response:", response);
                await getReviewsByBook(newReview.bookId);
            }



        } catch (error) {
            console.error("Det gick inte att skapa en recension:", error);

        }
    }

    const deleteReview = async (reviewId: string, userId: string, bookId: string): Promise<void> => {
        try {
            const response = await fetch(`https://dt210g-bokio-api.onrender.com/review/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })


            if (response.ok) {
                if (userId != "") {
                    await getReviewsById(userId);
                }

                if (bookId != "") {
                    await getReviewsByBook(bookId);
                }

            }

        } catch (error) {
            console.error("Det gick inte att radera recensionen:", error);
        }
    }

    const updateReview = async (reviewId: string, userId: string, putReview: PutReview, shouldUpdateById: boolean): Promise<void> => {
        try {

            putReview.userId = userId;

            const response = await fetch(`https://dt210g-bokio-api.onrender.com/review/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(putReview),
                credentials: "include"
            })
            console.log("updateReview putReview:", putReview)


            if (response.ok) {
                if (shouldUpdateById) {
                    await getReviewsById(userId);
                } else {
                    await getReviewsByBook(putReview.bookId);
                }
            }

        } catch (error) {
            console.error("Det gick inte att upddatera recensionen:", error);
        }

    }

    const likeReview = async (userReviewLike: boolean, reviewId: string): Promise<void> => {
        try {
            const like = { like: userReviewLike };

            const response = await fetch(`https://dt210g-bokio-api.onrender.com/review/${reviewId}/like`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(like),
                credentials: "include"
            })
            console.log("userReviewLike:", like)


            if (response.ok) {
                console.log("response:", response);
                const data = await response.json();
                await getReviewsByBook(data.review.bookId);
            }


        } catch (error) {
            console.error("Det gick inte att gilla en recension:", error);

        }

    }



    return (
        <ReviewContext.Provider value={{ reviews, bookTitleImageList, getReviews, getReviewsById, getReviewsByBook, postReview, deleteReview, updateReview, likeReview }}>
            {children}
        </ReviewContext.Provider>
    )
}

export const useReview = (): ReviewContextType => {
    const context = useContext(ReviewContext);

    if (!context) {
        throw new Error("useReview måste användas inom en ReviewProvider")
    }

    return context;
}


