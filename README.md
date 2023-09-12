# Github-get-contributions API

API that facilitates the total contributions count of any github user.

## Installation and setup

Run **npm install** and **npm start**.

(**Optional step**) The port can be defined in the .env file:

```toml
PORT=3000
```

## Endpoint queries

**Get total contributions from a certain date**

`http://localhost:3000/?user=<user>&from=<from>`

**Get contributions in a date range**

`http://localhost:3000/?user=<user>&from=<from>&to=<to>`

**Example**

`http://localhost:3000/?user=franelfers&from=2018&to=2023`
