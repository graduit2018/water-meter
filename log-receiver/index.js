const http = require('http');

function getFormattedDate() {
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

    return str;
}

http.createServer((request, response) => {
    request.on('error', (err) => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });

    response.on('error', (err) => {
        console.error(err);
    });

    if (request.method === 'POST' && request.url === '/litres') {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();

            body = JSON.parse(body);
            body['time'] = getFormattedDate();
            body = JSON.stringify(body);
            
            console.log(body);

            var kafka = require('kafka-node'),
                Producer = kafka.Producer,
                client = new kafka.KafkaClient({ kafkaHost: 'kafka:9093' }),
                producer = new Producer(client);

            payloads = [
                { topic: 'water', messages: body, partition: 0 },
            ];

            producer.on('ready', function () {
                producer.send(payloads, function (err, data) {
                    console.log('Sending');
                });
            });

            producer.on('error', function (err) { console.log(err) });

            response.end();
        });
    } else {
        response.statusCode = 404;
        response.end();
    }
}).listen(8080);

console.log('Started!');