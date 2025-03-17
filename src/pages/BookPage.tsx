import { useParams } from "react-router-dom"


function BookPage() {

    const {bookId} = useParams();
    console.log("bookId:",bookId);
  return (
    <>
    <h1>Bokdetaljer för bok med ID:{bookId}</h1>
    <p>Test</p>
    </>
  )
}

export default BookPage