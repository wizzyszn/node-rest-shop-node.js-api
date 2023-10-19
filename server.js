const http = require('http')
const app = require('./app')
const server = http.createServer(app);
let port =  3000
server.listen(port, ()=>{
    console.log('server is running on port:',port + '.......')
})