

export interface Book {
    id: string,
    title: string,
    authors: string[],
    description: string,
    thumbnail: string,
    pageCount: number
}

export interface BookTitleImage {
    bookId: string,
    title: string,
    thumbnail: string
}

export interface OneBook {
    id: string,
    title: string,
    authors: string[],
    description: string,
    thumbnail: string,
    pageCount: number

}

export interface BookContextType {
    books: Book[] | null,
    oneBook: OneBook | null,
    getBooks: (search: string) => void,
    getBookById: (bookId: string) => void,
  
}