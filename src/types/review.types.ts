import { User } from "./auth.types";
import { Book } from "./book.types";
export interface Review {
    _id: string,
    reviewText: string,
    rating: number,
    status: string,
    recommend: boolean,
    like: number,
    userId: { _id: string; username: string },
    bookId: string
}

export interface PostReview {
    reviewText: string,
    rating: number,
    status: string,
    recommend: boolean,
    userId: User["_id"],
    bookId: Book["id"]
}

export interface PutReview {
    reviewText: string,
    rating: number,
    status: string,
    recommend: boolean,
    userId: User["_id"],
    bookId: Book["id"]
}



export interface ReviewContextType {
    reviews: Review[] | null,
    bookTitles: string[] | null,
    getReviews: () => void,
    getReviewsById: (_id: string) => void,
    getReviewsByBook: (bookId: string) => void,
    postReview: (newReview: PostReview) => void,
    deleteReview:(reviewId: string, userId: string) => void,
    updateReview:(reviewId: string, userId: string, putReview: PutReview, shouldUpdateById: boolean) => void
}
