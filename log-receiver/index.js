const http = require('http');

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
            
            // console.log(body);

            var kafka = require('kafka-node'),
                Producer = kafka.Producer,
                client = new kafka.KafkaClient('zookeeper:2181'),
                producer = new Producer(client);

            payloads = [
                { topic: 'water', messages: body, partition: 0 },
            ];
    
            producer.on('ready', function() {
                producer.send(payloads, function(err, data) {
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