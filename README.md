# MARRVEL

## Install / Prepare to Run
1. Create the credential files below:
    * server/config/aws/{environment}.json
    
    ```json
    {
      "accessKeyId": "your key",
      "secretAccessKey": "your secret key"
    }
    ```
    * server/config/mongo/{environment}.json
    ```json
    {
      "host": "host",
      "port": "port",
      "user": "user name",
      "pwd": "password",
      "database": "database name for identification and retrieving data"
    }
    ```
    * server/config/omim/{environment}.json
    ```json
    "your omim key"
    ```
    * server/config/recaptcha/{environment}.json
    ```json
    "reCAPTCHA key"
    ```
2. Install Python packages `requirements.txt` and run setupTransVar.sh to install and configure TransVar.
    ```sh
    $ pip install -r requirements.txt
    $ ./setupTransVar.sh
    ```
3. Install packages with npm:
    ```sh
    $ npm install
    ```
    
## Run
Command to run API server:
```sh
$ node MARRVEL_API/app.js
```
Command to run client server:
```sh
$ ng serve
```

