from flask import Flask, render_template
app = Flask(__name__)

# TODO put required info, but not content, in a JSON object for each post
# and pass that to the template. Can perform validation in the view function
# to make sure needed info is included (eg. description, title, image)

# TODO update static paths

# TODO social cards

# TODO freeze pages, likely just render app at a given view


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/post/<title>")
def post(title):
    return render_template("{}.html".format(title))
