create table user (
  id INTEGER PRIMARY KEY,
  name VARCHAR(40) UNIQUE,
  password VARCHAR(40),
  api_key VARCHAR(40),
  bio TEXT
);

create table article (
  id INTEGER PRIMARY KEY,
  author_id INTEGER,
  title TEXT,
  contents TEXT,
  num_of_likes INTEGER,
  created_date TEXT,
  FOREIGN KEY(author_id) REFERENCES user(id)
);

create table follow (
    id INTEGER PRIMARY KEY,
    follower_id INTEGER,
    followee_id INTEGER,
    created_time TEXT,
    FOREIGN KEY(follower_id) REFERENCES user(id),
    FOREIGN KEY(followee_id) REFERENCES user(id)
);

