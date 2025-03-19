import { createContext, useState, useContext, ReactNode } from "react";
import { Book, OneBook, PostReview, PutReview, Review } from "../types/review.types";
import { ReviewContextType } from "../types/review.types";


const ReviewContext = createContext<ReviewContextType | null>(null);

interface ImagesProviderProps {
    children: ReactNode
}

export const ReviewProvider: React.FC<ImagesProviderProps> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [oneBook, setOneBook] = useState<OneBook | null>(null);

    const [bookTitles, setBookTitles] = useState<string[]>([]);

    //Hämta alla bilder publikt
    const getReviews = async (): Promise<void> => {
        try {
            const response = await fetch("http://localhost:3000/reviews", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setReviews(data.reviews);

            } else {
                setReviews([]);
            }

        } catch (error) {
            console.error("Det gick inte att hämta recensionerna:", error);
            setReviews([]);
        }
    }

    //Hämta böcker
    const getBooks = async (search: string): Promise<void> => {
        try {
            console.log("search:", search)
            const response = await fetch(`http://localhost:3000/books?title=${encodeURIComponent(search)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            })

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setBooks(data);

            } else {
                setBooks([]);
            }

        } catch (error) {
            console.error("Det gick inte att hämta böcker", error);
            setBooks([]);
        }
    }

    //Hämta bok utifrån bookId
    const getBookById = async (bookId: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/book/${bookId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            console.log("getBookById:", data);
            //console.log("Book volumeInfo thumbnail:", data.thumbnail);
            setOneBook(data);

        } catch (error) {
            console.error("Det gick inte att hämta recensioner", error);
            setOneBook(null);
        }

    }

    //Hämta reviews utifrån userId
    const getReviewsById = async (userId: string): Promise<void> => {

        try {
            const response = await fetch(`http://localhost:3000/reviews/${userId}`, {
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
            setReviews(data.reviewsByUserId);

            //Extrahera bookId från recensionerna
            const titles = await getBookTitles(data.reviewsByUserId);

            // Uppdatera state med alla boktitlar
            setBookTitles(titles);

        } catch (error) {
            console.error("Det gick inte att hämta recensioner", error);
            setReviews([]);
        }
    };

    async function getBookTitles(reviewList: any) {
        const bookIds = reviewList.map((review: Review) => review.bookId);
        //console.log("BokId:", bookIds);

        //console.log("Bok titel:", data.reviewsByUserId.title);

        //Hämta boktitlar för varje bokId
        const titles = await Promise.all(bookIds.map(async (id: string) => {
            try {
                const bookResponse = await fetch(`http://localhost:3000/book/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (!bookResponse.ok) return "Titel ej hittad";

                const bookData = await bookResponse.json();
                console.log("bookData:", bookData)
                return bookData.title || "Titel ej hittad";
            } catch (error) {
                console.error("Fel vid hämtning av bok:", error);
                return "Titel ej hittad";
            }
        }
        ));
        console.log("titles:", titles)
        return titles;
    }

    const getReviewsByBook = async (bookId: string): Promise<void> => {

        try {
            console.log("search:", bookId)
            const response = await fetch(`http://localhost:3000/reviews/book/${bookId}`, {
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
                //Extrahera bookId från recensionerna
                //const titles = await getBookTitles(data.reviews);
                // Uppdatera state med alla boktitlar
                //setBookTitles(titles);


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
            const response = await fetch("http://localhost:3000/review", {
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

    const deleteReview = async (reviewId: string, userId: string): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:3000/review/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })

            if (response.ok) {
                await getReviewsById(userId);
                
            }

        } catch (error) {
            console.error("Det gick inte att radera recensionen:", error);
        }
    }

    const updateReview = async(reviewId: string, userId: string, putReview: PutReview, shouldUpdateById: boolean): Promise<void> => {
        try {

            putReview.userId = userId;
            
            const response = await fetch(`http://localhost:3000/review/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(putReview),
                credentials: "include"
            })
            console.log("updateReview putReview:", putReview)


            if (response.ok) {
                if(shouldUpdateById) {
                    await getReviewsById(userId);
                } else {
                    await getReviewsByBook(putReview.bookId);
                }
            }

        } catch (error) {
            console.error("Det gick inte att upddatera recensionen:", error);
        }


    }



    return (
        <ReviewContext.Provider value={{ reviews, bookTitles, books, oneBook, getReviews, getBooks, getReviewsById, getReviewsByBook, getBookById, postReview, deleteReview, updateReview }}>
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


