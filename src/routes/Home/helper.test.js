import { searchResultWorkMapper, searchResultFormatter } from './helpers'

describe('helper for home route', () => {
  const work = {
    best_book: {
      id: 1,
      title: 'title',
      author: {
        name: 'joe',
        id: 1,
      },
      image_url: 'someUrl',
    },
    average_rating: 1,
    ratings_count: 1,
    original_publication_day: 1,
    original_publication_month: 1,
    original_publication_year: 1000,
  }

  describe('searchResultWorkMapper', () => {
    it('should correctly map the resuls from param', () => {
      const { best_book, average_rating, ratings_count } = work

      expect(searchResultWorkMapper(work)).toEqual({
        id: best_book.id,
        rating: average_rating,
        numberOfRatings: ratings_count,
        title: best_book.title,
        author: {
          name: best_book.author.name,
          id: best_book.author.id,
        },
        publicationDate: `
      1/
      1/
      1000
    `,
        imageUrl: best_book.image_url,
      })
    })
  })

  describe('searchResultFormatter', () => {
    it('should return a result with type of Array', () => {
      expect(searchResultFormatter(work) instanceof Array).not.toBeFalsy()
    })

    it('should return a result with type of Array', () => {
      expect(typeof searchResultFormatter(undefined) === 'undefined').not.toBeFalsy()
    })
  })
})
