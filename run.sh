#!/bin/sh

# Test the gateway when running locally via docker-compose up

curl -v -X POST -d @event.json http://localhost:8080/gateway

