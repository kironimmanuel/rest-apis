import Review from '../models/Review.js'

const getAllReviews = async (req, res) => {
  const { verifiedPurchase, sort, fields, numericFilters, name } = req.query
  const queryObject = {}

  if (verifiedPurchase) {
    queryObject.verifiedPurchase = verifiedPurchase === 'true' ? true : false
  }

  if (name) {
    // Searching for the query pattern (i abrogates the case sensitivity)
    queryObject.name = { $regex: name, $options: 'i' }
  }

  // Numeric filters
  if (numericFilters) {
    // Convert the filters so mongoose can interpret
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }

    // Regular Expression
    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    // We search for the key in operatorMap and convert the values
    let filters = numericFilters.replace(
      regEx,
      // Enclose the operatorMap[match] in simple punctuation (hyphen in this case)
      match => `-${operatorMap[match]}-`
    )
    const options = ['rating']
    filters = filters.split(',').forEach(item => {
      // Now with can split at hyphen with ease 👍
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        // Dynamic object properties
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }

  let result = Review.find(queryObject)

  if (sort) {
    const sortList = sort.split(',').join(' ')
    // result from the query object find
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }

  // Fields or Select - to filter the response and show only certain properties
  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  // // Pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 50
  // User passes in page value
  const skip = (page - 1) * limit
  result = result.skip(skip).limit(limit)

  // End results needs to be await
  const reviews = await result
  res.status(200).json({ reviews, nbHits: reviews.length })
}

export { getAllReviews }
