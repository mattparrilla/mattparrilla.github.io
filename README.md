# matthewparrilla.com

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

Then commit and push. GitHub pages uses the `docs` directory (by [convention](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)) as the root for the site.
