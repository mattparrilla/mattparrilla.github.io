from flask import Flask, render_template, request
import json

app = Flask(__name__)

# TODO update static paths

# TODO freeze pages, likely just render app at a given view


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/post/<title>")
def post(title):
    post_properties = {}
    with open("posts.json", "r") as f:
        posts = json.load(f)
        post_properties = posts[title]
    post_properties["url"] = request.path

    if not post_properties.get("title", False):
        raise ValueError("Missing title entry for {}".format(title))
    if not post_properties.get("description", False):
        raise ValueError("Missing description entry for {}".format(title))

    return render_template("{}.html".format(title), **post_properties)
