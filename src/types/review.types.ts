import { User } from "./auth.types";
export interface Review {
    _id: string,
    reviewText: string,
    rating: number,
    pagesRead: number,
    status: string,
    recommend: boolean,
    like: number,
    userId: { _id: string; username: string },
    bookId: string
}

export interface PostReview {
    reviewText: string,
    rating: number,
    pagesRead: number | null,
    status: string,
    recommend: boolean,
    userId: User["_id"],
    bookId: Book["id"]
}

export interface PutReview {
    reviewText: string,
    rating: number,
    pagesRead: number | null,
    status: string,
    recommend: boolean,
    userId: User["_id"],
    bookId: Book["id"]
}

export interface Book {
    id: string,
    title: string,
    authors: string,
    description: string,
    thumbnail: string
}

export interface OneBook {
    id: string,
    title: string,
    authors: string,
    description: string,
    thumbnail: string
}

export interface ReviewContextType {
    reviews: Review[] | null,
    books: Book[] | null,
    oneBook: OneBook | null,
    bookTitles: string[] | null,
    getReviews: () => void,
    getBooks: (search: string) => void,
    getReviewsById: (_id: string) => void,
    getReviewsByBook: (bookId: string) => void,
    getBookById: (bookId: string) => void,
    postReview: (newReview: PostReview) => void,
    deleteReview:(reviewId: string, userId: string) => void,
    updateReview:(reviewId: string, userId: string, putReview: PutReview, shouldUpdateById: boolean) => void
}
