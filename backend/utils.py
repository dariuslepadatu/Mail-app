import psycopg2
import bcrypt

# constants for database login
DATABASE='dariusdb'
USER='postgres'
PASSWORD='postgres'
HOST='0.0.0.0'
PORT='5432'

def databaseAuth(database=DATABASE, user=USER, password=PASSWORD, host=HOST, port=PORT):
	"""
	Login to the database with specified arguments.
	"""
	# Connect to the database
	conn = psycopg2.connect(database=database, user=user,
						password=password, host=host, port=port)

	# create a cursor
	cur = conn.cursor()
	return [conn, cur]

def hashPassword(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def checkPasswords(password, hashedPassword):
    hashedPassword = hashedPassword.replace(r'\x', '')
    binary_data = bytes.fromhex(hashedPassword)
    return bcrypt.checkpw(password.encode("utf-8"), binary_data)
