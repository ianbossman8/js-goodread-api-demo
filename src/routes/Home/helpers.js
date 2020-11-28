export function searchResultWorkMapper(work) {
  const {
    best_book,
    average_rating,
    ratings_count,
    original_publication_day,
    original_publication_month,
    original_publication_year,
  } = work

  const bookObj = {
    id: best_book.id,
    rating: average_rating,
    numberOfRatings: ratings_count,
    title: best_book.title,
    author: {
      name: best_book.author.name,
      id: best_book.author.id,
    },
    publicationDate: `
      ${original_publication_day ? original_publication_day + '/' : ''}
      ${original_publication_month ? original_publication_month + '/' : ''}
      ${original_publication_year || ''}
    `,
    imageUrl: best_book.image_url,
  }

  return bookObj
}

export function searchResultFormatter(result) {
  if (result) {
    // api would return an object when only one result from the query
    if (!Array.isArray(result)) {
      return [searchResultWorkMapper(result)]
    }

    return result.reduce((list, current) => {
      list.push(searchResultWorkMapper(current))
      return list
    }, [])
  }
}
