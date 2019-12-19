from flask_frozen import Freezer
from flask import Flask, render_template, request
import json

app = Flask(__name__)
freezer = Freezer(app)

app.config["FREEZER_DESTINATION_IGNORE"] = ["CNAME"]
app.debug = True


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


@app.route("/green-mountain-maps/index.html")
def map_index():
    maps = {}
    with open("maps.json", "r") as f:
        maps = json.load(f)
    return render_template("green-mountains.html",
        url=request.path,
        social_img="img/maps/stowe_2500.png",
        description="High resolution elevation maps of the Green Mountains designed for winter.",
        title="Green Mountain Maps",
        maps=maps)


@app.route("/green-mountain-maps/<title>/index.html")
def map(title):
    post_properties = {}
    with open("maps.json", "r") as f:
        posts = json.load(f)
        post_properties = posts[title]
    post_properties["url"] = request.path

    if not post_properties.get("title", False):
        raise ValueError("Missing title entry for {}".format(title))
    if not post_properties.get("description", False):
        raise ValueError("Missing description entry for {}".format(title))

    post_properties["category"] = "Green Mountain Maps"

    return render_template("lidar_map.html", **post_properties)


@freezer.register_generator
def map():
    with open("maps.json", "r") as f:
        posts = json.load(f)
        for title in posts.keys():
            if title != "index":
                yield {"title": title}


@freezer.register_generator
def post():
    with open("posts.json", "r") as f:
        posts = json.load(f)
        for title in posts.keys():
            if title != "index":
                yield {"title": title}


if __name__ == "__main__":
    freezer.freeze()
