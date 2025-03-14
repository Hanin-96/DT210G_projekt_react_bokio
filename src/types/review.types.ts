export interface Review {
    _id: string,
    reviewText: string,
    rating: number,
    pagesRead: number,
    status: string,
    like: number,
    recommend: boolean,
    userId: { _id: string; firstname: string; lastname: string; username: string },
    bookId: string
}

export interface Book {
    id: string,
    title: string,
    authors: string,
    description: string,
    thumbnail: string

}

export interface ReviewContextType {
    reviews: Review[] | null,
    books: Book[] | null,
    getReviews: () => void,
    getBooks: (search:string) => void
}
