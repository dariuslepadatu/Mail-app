from utils import *
from flask import request

def reset_password_page():
    [conn, cur] = databaseAuth()
    jsonObject = request.json
    
    mail = jsonObject['mail']
    otpCode = jsonObject['otpCode']
    password = jsonObject['password']
    
    try:
        cur.execute('''SELECT * FROM otpCodes WHERE mail = %s AND otp = %s''', (mail, otpCode))
        row = cur.fetchone()
        if row is None:
            return 'nonvalid'
        password = hashPassword(password)
        cur.execute('''UPDATE users SET password = %s WHERE mail = %s''', (password, mail))
        conn.commit()
        cur.execute('''DELETE FROM otpCodes WHERE mail = %s AND otp = %s''', (mail, otpCode))
        conn.commit() 
        
        return 'valid'
    
    finally:
        cur.close()
        conn.close()