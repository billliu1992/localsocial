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
	portrait		VARCHAR(30),
	UNIQUE(loginPlatform, platformId)
);

CREATE TYPE privacyValues as ENUM ('public', 'hide_last_name', 'hide_location', 'hide_both', 'friends');

CREATE TABLE posts (
	-- General post values
	postId			SERIAL PRIMARY KEY,
	authorId		INTEGER REFERENCES users (userId) NOT NULL,
	authorName		VARCHAR(60) NOT NULL,
	postBody		TEXT NOT NULL,
	postDate		TIMESTAMPTZ,
	privacy			privacyValues NOT NULL,
	cityName		VARCHAR(50) NOT NULL,
	longitude		DOUBLE PRECISION NOT NULL,
	latitude		DOUBLE PRECISION NOT NULL,

	-- Event values
	eventId			INTEGER,
	eventName		VARCHAR(100),
	eventLocation	VARCHAR(200),
	eventStart		TIMESTAMPTZ,
	eventEnd		TIMESTAMPTZ,

	-- Image values
	imageId			VARCHAR(30)
);