
from flask import Flask, render_template,request,redirect

app = Flask(__name__)

@app.route("/")
def Data():
    return "Hello world TEst"

if __name__ == '__main__':
    app.run(debug=True)
