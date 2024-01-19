import base64
import os
from utils import *
from flask import request, jsonify
from werkzeug.utils import secure_filename
import csv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import *
from email_validator import validate_email, EmailNotValidError  

def send_CSV_file():
	filename = ''
	if 'MailListFile' in request.files:
		file = request.files['MailListFile']
		filename = secure_filename(file.filename)
		file.save('/home/darius/Documents/SendMailApp/backend/server_files/' + filename)
		mailList = getMailListFromCSV('/home/darius/Documents/SendMailApp/backend/server_files/' + filename)
		print("Mail list: ", mailList)
		output = checkMails(mailList)

		if output == True:
			return 'success'
		else:
			return jsonify(output)
	else:
		return 'Error! File not received!'

def send_all_files():
    try:
        # Get the files from the request
        files = request.files.getlist('file')

        # Specify the directory to save files
        save_dir = '/home/darius/Documents/SendMailApp/backend/attach_files'

        if not os.path.exists(save_dir):
            os.makedirs(save_dir)

        for file in files:
            print(file.filename)
            file.save(os.path.join(save_dir, file.filename))

        return "success"
    except Exception as e:
        return "Error! Files not received"
    
def send_mail_page():
	[conn, cur] = databaseAuth()
	jsonObject = request.json
	
	title = jsonObject['title']
	message = jsonObject['message']
	filename = jsonObject['filename']
	attachedFiles = jsonObject['attachedFiles']
 
	save_dir = '/home/darius/Documents/SendMailApp/backend/attach_files'
	fullPaths = [os.path.join(save_dir, filename) for filename in attachedFiles]
	print(fullPaths)

	mailList = getMailListFromCSV('/home/darius/Documents/SendMailApp/backend/server_files/' + filename)
	print(mailList)
 
	sendMailAttachment(mailList, title, message, fullPaths)

	if mailList == 'error':
		cur.close()
		conn.close()
		return 'Error!'
	else:
		cur.execute('''INSERT INTO mails \
		(title, message, date) VALUES (%s, %s, CURRENT_TIMESTAMP)''',
		(title, message))
		conn.commit()
		cur.close()
		conn.close()
		return 'success'
	

def getMailListFromCSV(path):
	mailList = []
	try:
		data = []
		with open(path, 'r', newline='') as csvfile:
			csvreader = csv.DictReader(csvfile)
			for row in csvreader:
				data.append(row)
		for obj in data:
			mail = obj['mail']
			mailList.append(mail)
		return mailList
	except:
		return 'error'
	
def sendMail(mailList, title, text):
    message = Mail(
        from_email='darius.lepadatu@gmail.com',
        to_emails= mailList,
        subject = title,
        is_multiple=True,
        html_content=text)     

    try:
        sg = SendGridAPIClient('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')
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print("An error occurred:", e)
        
def sendMailAttachment(mailList, title, text, attachment_paths=[]):
    message = Mail(
        from_email='darius.lepadatu@gmail.com',
        to_emails=mailList,
        subject=title,
        html_content=text
    )
    
    attachments = []
    for attachment_path in attachment_paths:
        with open(attachment_path, 'rb') as f:
            file_content = f.read()
        
        attachment = Attachment()
        attachment.file_content = FileContent(base64.b64encode(file_content).decode())
        attachment.file_name = FileName(os.path.basename(attachment_path))
        attachment.disposition = Disposition('attachment')
        attachment.file_type = FileType('application/octet-stream')
        
        attachments.append(attachment)
    
    message.attachment = attachments
    
    try:
        sg = SendGridAPIClient('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')
        response = sg.send(message)
        print("Email sent. Response:")
        print("Status code:", response.status_code)
        print("Body:", response.body)
        print("Headers:", response.headers)
    except Exception as e:
        print("An error occurred:", e)
	
def checkMails(mail_list):
    invalid_emails = []

    for email in mail_list:
        try:
            validate_email(email)
        except EmailNotValidError:
            invalid_emails.append(email)

    if len(invalid_emails) == 0:
        return True
    else:
        return invalid_emails
