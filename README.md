# matthewparrilla.com

Note, the default branch for this repo is `source` not `master`. This is because,
as a "User" page, Github pages needs to serve from the root of the `master` branch.
The `source` branch contains the code that generates the HTML.

## To Publish

Generate HTML:

```
$ python3 app.py
```

Push content in `build` directory to `master`
```
$ git subtree push --prefix build origin master
```
