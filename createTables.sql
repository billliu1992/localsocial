CREATE TYPE platform AS ENUM ('facebook', 'twitter', 'instagram');

CREATE TABLE users (
	userId			SERIAL PRIMARY KEY,
	accessToken		VARCHAR(250) NOT NULL,
	accessSecret	VARCHAR(250),
	loginPlatform	platform NOT NULL,
	platformId		VARCHAR(75),

	firstName		VARCHAR(30) NOT NULL,
	lastName		VARCHAR(30) NOT NULL,
	nickName		VARCHAR(30),
	portrait		VARCHAR(30) NOT NULL,
	UNIQUE(loginPlatform, platformId)
)