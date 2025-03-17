import { createContext, useState, useContext, ReactNode } from "react";
import { Book, Review } from "../types/review.types";
import { ReviewContextType } from "../types/review.types";


const ReviewContext = createContext<ReviewContextType | null>(null);

interface ImagesProviderProps {
    children: ReactNode
}

export const ReviewProvider: React.FC<ImagesProviderProps> = ({ children }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [books, setBooks] = useState<Book[]>([]);

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
            const response = await fetch(`http://localhost:3000/books?title=" ${encodeURIComponent(search)}`, {
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
            setBooks([]);;
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
            const bookIds = data.reviewsByUserId.map((review: Review) => review.bookId);
            console.log("BokId:", bookIds);
    
            //Hämta boktitlar för varje bokId
            const titles = await bookIds.map(async (id: string) => {
                    try {
                        const bookResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            },
                        });
    
                        if (!bookResponse.ok) return "Titel ej hittad";
    
                        const bookData = await bookResponse.json();
                        return bookData.items?.[0]?.volumeInfo?.title || "Titel ej hittad";
                    } catch (error) {
                        console.error("Fel vid hämtning av bok:", error);
                        return "Titel ej hittad";
                    }
                }
            );
    
            // Uppdatera state med alla boktitlar
            setBookTitles(titles);
    
        } catch (error) {
            console.error("Det gick inte att hämta recensioner", error);
            setReviews([]);
        }
    };

    return (
        <ReviewContext.Provider value={{ reviews, bookTitles, books, getReviews, getBooks, getReviewsById }}>
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