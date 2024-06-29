from flask import Flask, jsonify, send_from_directory, redirect, url_for
import uuid
import random
import json

app = Flask(__name__)

# Define abilities and holds
abilities = [
    "Use Purple Holds",
    "Use Green Holds",
    "Use Hooks",
    "Move Freely",
]

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/styles.css')
def styles():
    return send_from_directory('.', 'styles.css')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

@app.route('/game.js')
def game_script():
    return send_from_directory('.', 'game.js')

@app.route('/new-session')
def new_session():
    session_id = str(uuid.uuid4())
    initial_state = '0000'  # initial state of the game
    random.shuffle(abilities)  # Shuffle abilities to randomize their order in the game

    return redirect(url_for('game', session_id=session_id, state=initial_state))

@app.route('/game/<session_id>/<state>')
def game(session_id, state):
    return send_from_directory('.', 'game.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
