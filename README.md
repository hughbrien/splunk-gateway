# splunk-gateway
Instana to Splunk event gateway

[Instana](https://instana.com/) can send events to a webhook. Unfortunately the format of the event JSON and the authentication requirements do not match what Splunk needs. This tiny bit of code, written with NodeJS and Express performs the required event transformation and adds in the authentication.
