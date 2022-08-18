# RESTful APIs

A variety of APIs written with Node.js, Express.js & mongoDB

###### General Security Packages setup

```sh
#app.js
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import xss from 'xss-clean' // cross site scripting

# If rate-limit is set up in app.js, it will apply to all routes
app.set('trust proxy', 1)
app.use(
  rateLimit({
    windowsMs: 15 * 60 * 1000, // 15 min.
    max: 100, // 100 calls per windowMs and IP
  })
)

app.use(helmet())
app.use(cors())
app.use(xss())
```
