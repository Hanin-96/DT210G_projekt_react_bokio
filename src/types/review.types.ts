import { User } from "./auth.types";
import { Book, BookTitleImage } from "./book.types";
export interface Review {
    _id: string,
    reviewText: string,
    rating: number,
    status: string,
    recommend: boolean,
    like: string[],
    userId: { _id: string; username: string },
    bookId: string,
    created: Date
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

export interface Like {
    like: boolean
}



export interface ReviewContextType {
    reviews: Review[] | null,
    bookTitleImageList: BookTitleImage[] | null,
    getReviews: () => void,
    getReviewsById: (_id: string) => void,
    getReviewsByBook: (bookId: string) => void,
    postReview: (newReview: PostReview) => void,
    deleteReview: (reviewId: string, userId: string, bookId: string) => void,
    updateReview: (reviewId: string, userId: string, putReview: PutReview, shouldUpdateById: boolean) => void,
    likeReview:(userReviewLike: boolean, reviewId: string) => void
}
