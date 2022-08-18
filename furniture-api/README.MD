# Reviews API (GET)

Array of 50 Objects including image urls

###### Nodemon

```sh
npm run dev
```

###### Query Params Options

Separated by &

```sh
verifiedPurchase: Boolean
# mongoose select() method to filter the response
fields: e.g. fields=name
# Limit 50
limit: limit=
# Select a page if limit is less than 50
page: page=
sort: e.g. sort=-name
numericFilters: e.g. numericFilters=rating>=4.5
'>': '$gt',
'>=': '$gte',
'=': '$eq',
'<': '$lt',
'<=': '$lte',
```

###### Security Packages setup

```sh
//app.js
import cors from 'cors'
import rateLimiter from 'express-rate-limit'
import helmet from 'helmet'
import xss from 'xss-clean' // cross site scripting

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowsMs: 15 * 60 * 1000, // 15 min.
    max: 100, // 100 calls per windowMs and IP
  })
)

app.use(helmet())
app.use(cors())
app.use(xss())
```
