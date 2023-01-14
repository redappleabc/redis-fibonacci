Input (index) will be sent from the client to the worker (via node server) which calculates the fibonacci number.<br>
The worker saves the calculations to the redis db.<br>
The nginx will redirect api request to the the node server and root request to the client<br>
<br>
The server is accesible from **localhost:3050** as follows

http://localhost:3050/api/output?ticket=100

or

axios.post('http://localhost:3050/api/input', {
    params: {
        index: 10
    }
  })

## Build an start up

```
docker-compose up
```

## Rebuild

```
docker-compose up --build
```

## Terminate

```
docker-compose down
```

