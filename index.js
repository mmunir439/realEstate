const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('real estate assignment website introduction to management!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
