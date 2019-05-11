# matthewparrilla.com

Note, the default branch for this repo is `default` not `master` (which is used as the by GitHub pages).

## To Publish

Generate HTML and then push `build/` to `master`.

```
$ python3 app.py
$ git subtree push --prefix build origin master
```
