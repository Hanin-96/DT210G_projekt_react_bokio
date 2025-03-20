import { createContext, useState, useContext, ReactNode } from "react";
import { Book, OneBook } from "../types/book.types";
import { BookContextType } from "../types/book.types";


const BookContext = createContext<BookContextType | null>(null);

interface BooksProviderProps {
    children: ReactNode
}

export const BookProvider: React.FC<BooksProviderProps> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [oneBook, setOneBook] = useState<OneBook | null>(null);

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



    return (
        <BookContext.Provider value={{ books, oneBook, getBooks, getBookById }}>
            {children}
        </BookContext.Provider>
    )
}

export const useBook = (): BookContextType => {
    const context = useContext(BookContext);

    if (!context) {
        throw new Error("useReview måste användas inom en ReviewProvider")
    }

    return context;
}


