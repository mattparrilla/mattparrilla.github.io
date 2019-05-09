from flask import Flask, render_template
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/post/<title>")
def post(title):
    return render_template("{}.html".format(title))
