const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
// console.log(express)

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.static("express")); // default URL for website

app.use('/', function(req,res){
    res.sendFile(path.join(__dirname+'/express/index.html'));
    //__dirname : resolves to project folder.
  });
  
  const server = http.createServer(app);
  const PORT =  process.env.PORT || 3200;
  server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  // console.debug('Server listening on port ' + PORT);  // optional ;-)