# Pizza Restaurant Microservices

This project demonstrates a microservices-based architecture for a pizza restaurant that uses RabbitMQ for communication between the services.
## Architecture

The application consists of the following microservices:

- 2 Dough Chef Services
- 3 Topping Chef Services
- Oven Service
- 2 Waiter Services

These microservices communicate with each other through a RabbitMQ message broker.

## Tech-Stack

- Docker
- Docker Compose
- Typescript
- Node
- RabbitMQ
- Kubernetes (optional)
- MongoDb (optional)

## Running the project

### Using Docker Compose

Build the Docker images for each service using this command:
`docker-compose up --build `

The app will run and you send orders by using HTTP request you can use postman or curl using this url: `http://localhost:3005/order` 

example:

#### postman
```json
[
    {
        "id": "123",
        "toppings": ["ham", "pineapple", "cheese", "olives", "corn"],
        "doughReady": false,
        "toppingsReady": false,
        "cooked": false,
        "served": false
    },
    {
        "id": "123415",
        "toppings": ["cheese", "olives", "corn"],
        "doughReady": false,
        "toppingsReady": false,
        "cooked": false,
        "served": false
    },
    {
        "id": "2351231",
        "toppings": ["ham", "corn"],
        "doughReady": false,
        "toppingsReady": false,
        "cooked": false,
        "served": false
    }
]
```

#### terminal
```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "id": "123",
    "toppings": ["cheese", "pepperoni", "mushrooms"]
}' "http://localhost:3005/order"
```

## Monitoring

Each service logs its progress as it processes pizza orders. You can monitor the logs for each service to observe the flow of orders through the system.

When using Docker Compose, the logs can be viewed using the `docker-compose logs` command or via docker app dashboard.
or you can see the logs in your terminal where you ran docker command