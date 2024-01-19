from send_mail import sendMail
from utils import *
from flask import request

def register_page():
	[conn, cur] = databaseAuth()

	jsonObject = request.json	
	mail = jsonObject['mail']
	password = jsonObject['password']

	cur.execute('''SELECT * FROM users WHERE mail = %s''',(mail, ))
	rows = cur.fetchall()

	if rows:
		conn.commit()
		cur.close()
		conn.close()
		return 'error:used-mail'
	else :
		# check mail!!!!
		newPassword = hashPassword(password)
		cur.execute(
			'''INSERT INTO users \
			(mail, password) VALUES (%s, %s)''',
			(mail, newPassword))

		conn.commit()
		cur.close()
		conn.close()
		# sendMail(mail, 'Account created', "Hello! Thank you for using our app,\
      	# your account was succesfully created.")
		return 'success'