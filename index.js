const connectToMongo = require('./db')
const express = require('express')  
var cors = require('cors')

const app = express()
const port =  1708;

 
app.use(cors())
connectToMongo();

app.use(express.json());

// Available Routes 
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})