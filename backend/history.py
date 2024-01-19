from utils import *
from flask import request, jsonify


def history_page():
	"""
	Fetches data (mails) from postgres server based on a start date and end date. 
	Incoming data: json (start_date, end_date)
	return: json (mail list)
	"""
	[conn, cur] = databaseAuth()
	jsonObject = request.json
	start_date = jsonObject['start_date']
	end_date = jsonObject['end_date']	
	cur.execute('''SELECT title, message, TO_CHAR(date, 'HH:MI DD-MM-YYYY') FROM mails \
	    WHERE date BETWEEN %s AND %s \
	    ORDER BY date DESC''', (start_date, end_date))	

	data = cur.fetchall()
	mail_list = []

	for row in data:
		mail = {'title': row[0],
	  			'message': row[1],
				'date': row[2] }
		mail_list.append(mail)
	cur.close()
	conn.close()

	return jsonify(mail_list)