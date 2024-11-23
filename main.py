from flask import Flask, render_template, request, jsonify, redirect



app = Flask(__name__)

last_score = 0
highest_score = 0

with open('highest_score.txt', 'r') as file:
    a = file.read()
    last_score = int(a)
    highest_score = int(a)


@app.route('/')
def index():
    print(last_score)
    return render_template('start_game.html', highest_score=highest_score, last_score=last_score)


@app.route('/update_score', methods=['POST'])
def update_score():
    global last_score, highest_score
    b = request.json
    last_score = b.get('result_score')
    if last_score > highest_score:
        highest_score = last_score
        with open('highest_score.txt', 'w') as file:
            file.write(str(highest_score))

    return redirect('/')
    

@app.route('/game')
def start_game():
    return render_template('index.html')



if __name__ == '__main__':
    app.run(debug=True)