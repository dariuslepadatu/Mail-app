from utils import *
from flask import request
from send_mail import *
import math, random

def forgot_password_page():
    [conn, cur] = databaseAuth()
    jsonObject = request.json

    mail = jsonObject['mail']
    cur.execute('''SELECT * FROM users \
        where mail = %s''',
    (mail, ))

    row = cur.fetchone()
    cur.close()
    conn.close()
    if row is None:
        return 'nonvalid'
    otp = generateOTP(mail)
    if otp == 'nonvalid':
        return 'error:mailsent'

    sendMail(mail, 'Changing password OTP code', \
             "Hello! Use the code " + otp + " to change your password.")
 
    return 'valid'

def generateOTP(mail):
    [conn, cur] = databaseAuth()
    # if you already have any table or not id doesnt matter this
    # will create a otpCodes table for you.
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS otpCodes (id serial PRIMARY KEY, mail varchar(100), otp varchar(6), time TIMESTAMP);''')

    # commit the changes
    conn.commit()
    # Declare a string variable
    # which stores all string
    cur.execute('''DELETE FROM otpCodes WHERE time < NOW() - INTERVAL '5 minutes';''')
    conn.commit() 

    cur.execute('''SELECT * FROM otpCodes where mail = %s''', (mail, ))
    row = cur.fetchone()
    if row is not None:
        return 'nonvalid'  
    
    string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    OTP = ""
    length = len(string)
    for i in range(6):
        OTP += string[math.floor(random.random() * length)]
    

    cur.execute('''SELECT * FROM otpCodes where otp = %s''', (OTP, ))
    row = cur.fetchone()
    if row is not None:
        generateOTP(mail)  
        
    cur.execute(
        '''INSERT INTO otpCodes (mail, otp, time) VALUES (%s, %s, CURRENT_TIMESTAMP);''', (mail, OTP))
    conn.commit()
    return OTP