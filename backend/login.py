from utils import *
from flask import request

def login_page():
    [conn, cur] = databaseAuth()
    jsonObject = request.json

    mail = jsonObject['mail']
    password = jsonObject['password']

    cur.execute('''SELECT * FROM users \
        where mail = %s''',
    (mail,))

    row = cur.fetchone()
    cur.close()
    conn.close()
    if row is not None and checkPasswords(password, row[2]):
        return 'valid' 
    else:
        return 'nonvalid'