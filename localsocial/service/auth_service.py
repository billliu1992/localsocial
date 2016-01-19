import bcrypt

#TODO: use HMAC for secret key for passwords

def hash_password(password):
	salt = bcrypt.gensalt()
	password_encoded = password.encode("utf-8")

	hashed = bcrypt.hashpw(password_encoded, salt)

	return (hashed, salt)

def check_password(password, test_hash, salt):
	password_encoded = password.encode("utf-8")
	hashed = bcrypt.hashpw(password_encoded, salt)


	return hashed == test_hash

def check_password_strength(password):
	#TODO Implement
	return True