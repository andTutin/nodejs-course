const http = require("http");
require('dotenv').config()
const tickInterval = process.env.TICK_INTERVAL;
const clockTime = process.env.CLOCK_TIME;
const port = process.env.PORT;

http.createServer((request, response) => {
    if(request.url === '/'){

        let timerId = setInterval(() => {
            console.log(Date.now())
        }, tickInterval);
        
        setTimeout(() => {
            clearInterval(timerId);
            response.setHeader("Content-Type", "text/html; charset=utf-8;");
            response.write(`<h2>Текущее время ${new Date}</h2>`);
            response.end();
        }, clockTime);
    }
       
}).listen(port);