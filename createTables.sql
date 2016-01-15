DROP TABLE IF EXISTS posts;
DROP TYPE IF EXISTS privacyValues;
DROP TABLE IF EXISTS platformLink;
DROP TYPE IF EXISTS platform;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	userId			SERIAL PRIMARY KEY,

	-- Password
	hash			VARCHAR(60) NOT NULL,
	salt			VARCHAR(60) NOT NULL,

	-- Identifiers
	email			VARCHAR(60) UNIQUE NOT NULL,
	phone			BIGINT CHECK(phone > 0),

	-- Public Fields
	firstName		VARCHAR(30) NOT NULL,
	lastName		VARCHAR(30) NOT NULL,
	nickName		VARCHAR(30),
	biography		TEXT CHECK(char_length(biography) <= 300),
	portrait		VARCHAR(30)

	-- Preferences
	showLastName			BOOLEAN NOT NULL,
	showExactLocation		BOOLEAN NOT NULL,
	searchableByName		BOOLEAN NOT NULL,
	useBrowserGeolocation	BOOLEAN NOT NULL
);

CREATE TYPE platform AS ENUM ('facebook', 'twitter', 'instagram');

CREATE TABLE platformLink (
	userId			INTEGER REFERENCES users (userId) NOT NULL,
	loginPlatform	platform NOT NULL,
	externalId		VARCHAR(75) NOT NULL,
	UNIQUE(loginPlatform, externalId)
);

CREATE TYPE privacyValues as ENUM ('public', 'friends');

CREATE TABLE posts (
	-- General post values
	postId			SERIAL PRIMARY KEY,
	authorId		INTEGER REFERENCES users (userId) NOT NULL,
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

CREATE TABLE likes (
	postId			INTEGER REFERENCES posts (postId) NOT NULL,
	likerId			INTEGER REFERENCES users (postId) NOT NULL,
	UNIQUE(postId, likerId)
);

CREATE TABLE replies (
	replyId			SERIAL PRIMARY KEY,
	postId			INTEGER REFERENCES posts (postId) NOT NULL,
	authorId		INTEGER REFERENCES users (userId) NOT NULL,
	authorName		VARCHAR(60) NOT NULL,
	replyBody		TEXT NOT NULL,
	replyDate		TIMESTAMPTZ,
	cityName		TEXT NOT NULL,
	longitude		DOUBLE PRECISION NOT NULL,
	latitude		DOUBLE PRECISION NOT NULL,

	edited			BOOLEAN NOT NULL
);

CREATE TABLE userFollows (
	firstUserId			INTEGER REFERENCES users (userId) NOT NULL,
	secondUserId		INTEGER REFERENCES users (userId) NOT NULL,
	UNIQUE(firstUserId, secondUserId)
);

CREATE TABLE userFriends (
	firstUserId			INTEGER REFERENCES users (userId) NOT NULL,
	secondUserId		INTEGER REFERENCES users (userId) NOT NULL,
	UNIQUE(firstUserId, secondUserId)
);