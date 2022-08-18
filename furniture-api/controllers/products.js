const Product = require('../models/product')

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
  const queryObject = {}
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (company) {
    queryObject.company = company
  }
  if (name) {
    // Searching for the query pattern (i abrogates the case sensitivity)
    queryObject.name = { $regex: name, $options: 'i' }
  }
  // Fields or Select - to filter the response and show only certain properties
  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
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
    const options = ['price', 'rating']
    filters = filters.split(',').forEach(item => {
      // Now with can split at hyphen with ease
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        // Dynamic setting the object property
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }
  let result = Product.find(queryObject)

  if (sort) {
    const sortList = sort.split(',').join(' ')
    // result from the query object find
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }

  // Pagination
  const page = Number(req.query.page) || 1
  // If no limit is provided we stay at 2 pages -> 10 10
  const limit = Number(req.query.limit) || 10
  // User passes in page value
  const skip = (page - 1) * limit
  // Changing the limit, changes the skip as well
  result = result.skip(skip).limit(limit)

  // End results needs to be await
  const products = await result
  res.status(200).json({ products, nbHits: products.length })
}

module.exports = { getAllProducts }
