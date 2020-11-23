import React, { useEffect, useState } from 'react'
import './detailed-book-list.css'

function DetailedBookList(props) {
  const [bookDescriptionLength, setBookDescriptionLength] = useState({})
  const { books } = props

  const standardTextLimit = 200

  function handleReadMore(bookId, textLength) {
    setBookDescriptionLength((prevState) => {
      return {
        ...prevState,
        [bookId]: textLength,
      }
    })
  }

  function handleReadLess(bookId) {
    setBookDescriptionLength((prevState) => {
      return {
        ...prevState,
        [bookId]: standardTextLimit,
      }
    })
  }

  useEffect(() => {
    const bookDesc = books.reduce((acc, curBook) => {
      acc = {
        ...acc,
        [curBook.id]: curBook.description.length > standardTextLimit ? standardTextLimit : curBook.description.length,
      }

      return acc
    }, {})

    setBookDescriptionLength(bookDesc)
  }, [books])

  return (
    <ul>
      {books.map((book) => {
        return (
          <li key={book.id} className="detailed-book-list__item">
            <div>
              <img src={book.image_url} alt={book.title} />
              {book.average_rating && (
                <p>
                  average rating- {book.average_rating}
                  <small> number of counts {book.ratings_count}</small>
                </p>
              )}
            </div>

            <div className="detailed-book-list__item-detail">
              {book.isbn ? <p>ISBN- {book.isbn}</p> : ''}
              {book.text_reviews_count && <p>text reviews count- {book.text_reviews_count}</p>}
              {book.num_pages && <p>number of pages- {book.num_pages}</p>}
              {book.format && <p>format- {book.format}</p>}
              {book.publication_year && <p>publication year- {book.publication_year}</p>}
              {book.description && (
                <p>
                  <span>description- {book.description.slice(0, bookDescriptionLength[book.id])}</span>
                  {book.description.length <= standardTextLimit ? (
                    ''
                  ) : bookDescriptionLength[book.id] <= standardTextLimit ? (
                    <span>
                      ...{' '}
                      <button
                        name="read-expand__button"
                        onClick={() => handleReadMore(book.id, book.description.length)}
                      >
                        read more
                      </button>
                    </span>
                  ) : (
                    <button name="read-expand__button" onClick={() => handleReadLess(book.id)}>
                      read less
                    </button>
                  )}
                </p>
              )}
              {book.link && (
                <a href={book.link} target="_blank" rel="noreferrer">
                  {book.title} link in Goodread
                </a>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default DetailedBookList
