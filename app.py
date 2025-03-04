from flask_frozen import Freezer
from flask import Flask, render_template, request
import json

app = Flask(__name__)
freezer = Freezer(app)

app.config["FREEZER_DESTINATION_IGNORE"] = ["CNAME"]
app.config["FREEZER_STATIC_IGNORE"] = ["*.scss"]
app.config["FREEZER_DESTINATION"] = "docs"
app.debug = True


@app.route("/")
def index():
    post_properties = {}
    with open("posts.json", "r") as f:
        posts = json.load(f)
        post_properties = posts["index"]
    post_properties["url"] = request.path
    return render_template("index.html", **post_properties)


@app.route("/summer-of-protocols-resume.html")
def sop_resume():
    description = "The resume of Matt Parrilla for the Summer of Protocols Core Researcher. Matt wants to create a protocol for connecting a wallet to a physical location."
    return render_template("sop_resume.html", url=request.path)


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


@freezer.register_generator
def post():
    with open("posts.json", "r") as f:
        posts = json.load(f)
        for title in posts.keys():
            if title != "index":
                yield {"title": title}


if __name__ == "__main__":
    freezer.freeze()
