const http = require("http");
require('dotenv').config()
const tickInterval = process.env.TICK_INTERVAL;
const clockTime = process.env.CLOCK_TIME;
const port = process.env.PORT;
let activeConnections = 0;
let timerId;

http.createServer((request, response) => {
    if(request.url === '/') {
        if (activeConnections == 0) {
            timerId = setInterval(() => {
                console.log(Date.now())
            }, tickInterval);
        }

        activeConnections++;
        
        setTimeout(() => {
            response.setHeader("Content-Type", "text/html; charset=utf-8;");
            response.write(`<h2>Текущее время ${new Date}</h2>`);
            response.end();
            activeConnections--;
            if (activeConnections == 0) {
                clearInterval(timerId);
            }
        }, clockTime);
    }     
}).listen(port);