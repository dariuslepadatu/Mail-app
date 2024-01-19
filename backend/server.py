from flask import Flask, render_template
from flask_cors import CORS
from sendgrid.helpers.mail import *

from register import *
from login import *
from forgot_password import *
from reset_password import *
from history import *
from send_mail import *
from statistics_mail import *
from utils import *

app = Flask(__name__)
CORS(app)

[conn, cur] = databaseAuth()

cur.execute(
	'''CREATE TABLE IF NOT EXISTS users (id serial \
	PRIMARY KEY, mail varchar(100), password varchar(250));''')

conn.commit()
cur.close()
conn.close()

[conn, cur] = databaseAuth()

cur.execute(
	'''CREATE TABLE IF NOT EXISTS mails (id serial \
	PRIMARY KEY, title varchar(1000), message varchar(65000), date TIMESTAMP);''')

conn.commit()
cur.close()
conn.close()


@app.route('/')
def index():
	"""
	Display data to pyhton server.
	"""
	[conn, cur] = databaseAuth()
	cur.execute('''SELECT * FROM users''')
	data = cur.fetchall()
	conn.commit()
	cur.close()
	conn.close()
	return render_template('index.html', data=data)

@app.route('/register', methods=['POST', 'GET'])
def register():
	return register_page()

@app.route('/login', methods=['POST', 'GET'])
def login():
	return login_page()

@app.route('/forgot-password', methods=['POST', 'GET'])
def forgotPassword():
	return forgot_password_page()

@app.route('/reset-password', methods=['POST', 'GET'])
def resetPassword():
    return reset_password_page()
	
@app.route('/main-menu/send-mail/file', methods=['POST'])
def sendMailFile():
	return send_CSV_file()

@app.route('/main-menu/send-mail/files', methods=['GET', 'POST'])
def sendMailFiles():
	return send_all_files()
	
@app.route('/main-menu/send-mail', methods=['GET', 'POST'])
def sendMail():
	return send_mail_page()
	

@app.route('/main-menu/history', methods=['GET', 'POST'])
def history():
	return history_page()

@app.route('/main-menu/statistics', methods=['POST', 'GET'])
def statistics():
    return statistics_page()

if __name__ == '__main__':
	app.run(debug=True)