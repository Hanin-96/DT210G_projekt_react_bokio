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

    return (
        <ReviewContext.Provider value={{ reviews, books, getReviews, getBooks }}>
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