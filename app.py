from flask_frozen import Freezer
from flask import Flask, render_template, request
import json

app = Flask(__name__)
freezer = Freezer(app)

app.config["FREEZER_DESTINATION_IGNORE"] = ["CNAME"]


@app.route("/")
def index():
    post_properties = {}
    with open("posts.json", "r") as f:
        posts = json.load(f)
        post_properties = posts["index"]
    post_properties["url"] = request.path
    return render_template("index.html", **post_properties)


@app.route("/post/<title>/index.html")
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


@app.route("/maps/<title>/index.html")
def map(title):
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


@freezer.register_generator
def map():
    with open("posts.json", "r") as f:
        posts = json.load(f)
        for title in posts.keys():
            yield {"title": title}


@freezer.register_generator
def post():
    with open("posts.json", "r") as f:
        posts = json.load(f)
        for title in posts.keys():
            yield {"title": title}


if __name__ == "__main__":
    freezer.freeze()
