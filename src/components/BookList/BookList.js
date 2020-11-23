import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './booklist.css'

function BookList(props) {
  const location = useLocation()

  const [hoveredItem, setisHovered] = useState()

  function handleHover(e) {
    setisHovered(parseInt(e.target.id))
  }

  function handleHoverOut() {
    setisHovered('')
  }

  function handleHoverDiv(id) {
    setisHovered(id)
  }

  return (
    <ul className="book-list">
      {props.items.map((item) => (
        <li key={item.id} className="book-list__items">
          <div className="book-list__items-container">
            <div
              className="book-list__items-image"
              style={{
                backgroundImage: `url(${item.imageUrl})`,
              }}
              alt={`book cover of ${item.title}`}
              id={item.id}
              onMouseOver={handleHover}
              onMouseLeave={handleHoverOut}
            >
              <h3>{item.title}</h3>
            </div>
            {hoveredItem === item.id && (
              <div
                className="book-list__items-container__info"
                onMouseEnter={() => handleHoverDiv(item.id)}
                onMouseLeave={handleHoverOut}
              >
                <h3>{item.title}</h3>
                <p className="book-list__items-container__info__author">
                  <span>
                    <b>author-</b> {item.author.name}
                  </span>
                  <Link
                    to={{
                      pathname: `/author/${item.author.name}/${item.author.id}`,
                      state: { from: `${location.pathname}${location.search}` },
                    }}
                    onClick={() => props.getAuthorDetails(item.author.id)}
                  >
                    more about {item.author.name}
                  </Link>
                </p>
                <p>
                  <b>publication date-</b> {item.publicationDate}
                </p>
                <p>
                  <b>ratings-</b> {item.rating} <small>(number of rates {item.numberOfRatings})</small>
                </p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default BookList
