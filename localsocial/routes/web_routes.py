from flask import send_from_directory, redirect
from localsocial import app

@app.route('/')
def serve_index_page():
	return redirect('/web/index.html')
