const notFound = (req, res) =>
  res
    .status(404)
    .send(
      `<h1>404</h1><h3>Oops! You weren't supposed to see this!</h3><a href="/">Back home</a>`
    )

module.exports = notFound
