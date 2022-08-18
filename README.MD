# RESTful APIs

A variety of APIs written with Node.js, Express.js & mongoDB

###### General Security Packages setup

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
