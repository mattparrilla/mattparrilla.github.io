# matthewparrilla.com

## Set Up

1. Install compass dependency
    `gem install compass`
1. Install python dependencies
    ```
    $ virtualenv venv
    $ source venv/bin/activate
    $ pip install -r requirements.txt
    ```
1. Install npm packages
    ```
    $ cd static
    $ npm install
    ```

## To Run

Watch for changes to static files:

`npm run grunt`

Run Flask server:

`python sitebuilder.py`

## To Build

`python sitebuilder.py build`
