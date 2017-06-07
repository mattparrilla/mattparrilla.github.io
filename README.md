# matthewparrilla.com

Note, the default branch for this repo is `default` not `master` (which is used as the by GitHub pages).

## Set Up

1. Install compass dependency
    ```
    $ gem install compass
    ```
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

Build website from flask app:

```
$ python sitebuilder.py build
```

Push `build/` to master.

```
$ git subtree push --prefix build origin master
```

This is necessary because github custom domains require you use the `master` branch without giving you the ability to specify a root.
