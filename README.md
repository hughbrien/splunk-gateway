# splunk-gateway
Instana to Splunk event gateway

[Instana](https://instana.com/) can send events to a webhook. Unfortunately the format of the event JSON and the authentication requirements do not match what Splunk needs. This tiny bit of code, written with NodeJS and Express performs the required event transformation and adds in the authentication.

## Usage
Typically just run the Docker container locally or via a cloud provider: AWS ECS, Google Compute, OpenShift etc.

The following environment variables must be set:

- GATEWAY_SPLUNK_URL - The URL of the Splunk event receiver e.g. http://splunk.host.com/services/collector
- GATEWAY_SPLUNK_KEY - The API token generated from via the Splunk console
- GATEWAY_SERVER_PORT - Port to listen on. Default 8080

