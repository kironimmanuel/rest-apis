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
# Limit 20
limit: limit=
# Select a page if limit is less than 20
page: page=
sort: e.g. sort=-name
numericFilters: e.g. numericFilters=rating>=4.5
'>': '$gt',
'>=': '$gte',
'=': '$eq',
'<': '$lt',
'<=': '$lte',
```
