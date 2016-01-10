from flask import send_file, redirect
from localsocial import app

@app.route('/')
def serve_index_page():
	return redirect('/web/home.html')

@app.route('/portrait/test')
def serve_test_portrait():
	return send_file('test-portrait.jpg')
