# MARRVEL

## Install / Prepare to Run
1. Create the credential files below:
    * app/config/aws/{environment}.json
    
    ```json
    {
      "accessKeyId": "your key",
      "secretAccessKey": "your secret key"
    }
    ```
    * app/config/mongo/{environment}.json
    ```json
    {
      "host": "host",
      "port": "port",
      "user": "user name",
      "pwd": "password",
      "database": "database name for identification and retrieving data"
    }
    ```
    * app/config/omim/{environment}.json
    ```json
    "your omim key"
    ```
    * app/config/recaptcha/{environment}.json
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
## Build
Command to build
```sh
$ ng build --prod
```

## Run
Command to run the server:
```sh
$ node app
```

