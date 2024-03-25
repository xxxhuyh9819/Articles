import string
import sqlite3
import random
from flask import *
import datetime
from flask_cors import cross_origin

app = Flask(__name__)


def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect('db/blog.sqlite3')
        db.row_factory = sqlite3.Row
        setattr(g, '_database', db)
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def query_db(query, args=(), one=False):
    db = get_db()
    db.execute('PRAGMA foreign_keys = ON')
    cursor = db.execute(query, args)
    rows = cursor.fetchall()
    db.commit()
    cursor.close()
    if rows:
        if one:
            return rows[0]
        return rows
    return None


def new_user(username, password):
    api_key = ''.join(random.choices(string.ascii_lowercase + string.digits, k=40))

    u = query_db('insert into user (name, password, api_key) ' +
                 'values (?, ?, ?) returning id, name, password, api_key',
                 (username, password, api_key),
                 one=True)
    return u


@app.route('/')
# @app.route('/login')
def index():
    return app.send_static_file('index.html')


@app.route('/api/login', methods=['POST'])
@cross_origin()
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    query = 'select * from user where user.name = ?'
    try:
        user = query_db(query, (username,), one=True)
        if not user:
            return jsonify("This user doesn't exist!"), 404

        query = '''
        select u.id, u.name, u.api_key, u.bio as bio, count(f.id) AS num_of_followers
        from user u
        left join follow f on u.id = f.followee_id
        where u.name = ? and u.password = ?
        group by u.id, u.name, u.password, u.api_key;
        '''
        user = query_db(query, (username, password), one=True)
        if not user:
            return jsonify("Incorrect password!"), 403

        form = {'user_id': user['id'],
                'user_name': user['name'],
                'user_token': user['api_key'],
                'user_bio': user['bio'],
                'num_of_followers': user['num_of_followers']}

        query = 'select followee_id from follow where follower_id = ?'
        result = query_db(query, (user['id'],), one=False)
        accounts_following = []
        if result:
            for r in result:
                accounts_following.append(int(*r))
        form['accounts_following'] = accounts_following
        return jsonify(form), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/register', methods=['POST'])
@cross_origin()
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    confirm_password = request.json.get('confirm_password')

    if password != confirm_password:
        return jsonify("Password and confirm password don't match!"), 403

    query = "select * from user where name = ?"
    old_user = query_db(query, (username,), one=True)
    if old_user:
        return jsonify("This user name has been occupied!"), 403

    try:
        user = new_user(username, password)
        return jsonify({'user_id': user['id'],
                        'user_name': user['name'],
                        'user_token': user['api_key'],
                        'user_bio': user['bio'],
                        'num_of_followers': 0,
                        'accounts_following': []}), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/update_username', methods=['PUT'])
@cross_origin()
def update_username():
    username = request.json.get('user_name')
    new_username = request.json.get('new_username')
    user_token = request.json.get('user_token')
    user_id = int(request.json.get('user_id'))

    if not user_token:
        return jsonify("User token is required!"), 401
    if username == new_username:
        return jsonify("New username must be different!"), 401

    query = "select * from user where name = ?"
    try:
        old_user = query_db(query, (new_username,), one=True)
        if old_user:
            return jsonify("This user name has been occupied!"), 403
        query = "update user set name = ? where id = ?"
        query_db(query, (new_username, user_id), one=True)

        return jsonify(new_username), 200

    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/update_password', methods=['PUT'])
@cross_origin()
def update_password():
    old_password = request.json.get('old_password')
    new_password = request.json.get('new_password')
    user_token = request.json.get('user_token')

    if not user_token:
        return jsonify("User token is required!"), 401
    if old_password == new_password:
        return jsonify("New password must be different!"), 401

    query = "select * from user where password = ?"
    try:
        user = query_db(query, (old_password,), one=True)
        if not user:
            return jsonify("Incorrect password!"), 401
        query = "update user set password = ? where api_key = ?"
        query_db(query, (new_password, user_token), one=True)

        return jsonify("Password updated successfully!"), 200

    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/update_bio', methods=['PUT'])
@cross_origin()
def update_bio():
    bio = request.json.get('user_bio')
    new_bio = request.json.get('new_bio')
    user_token = request.json.get('user_token')
    user_id = int(request.json.get('user_id'))

    if not user_token:
        return jsonify("User token is required!"), 401
    if bio == new_bio:
        return jsonify("New bio must be different!"), 401

    try:
        query = "update user set bio = ? where id = ?"
        query_db(query, (new_bio, user_id), one=True)

        return jsonify(new_bio), 200

    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/articles', methods=['GET'])
@cross_origin()
def get_articles():
    query = '''
    select a.id, a.title, a.contents, a.create_date, u.name as author
    FROM article a
    left join user u on u.id = a.author_id
    group by a.id, a.title;
    '''
    try:
        articles = query_db(query, (), one=False)
        return jsonify([dict(a) for a in articles]), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/check_article', methods=['GET'])
@cross_origin()
def check_article():
    article_id = request.args.get('id')
    user_token = request.args.get('user_token')

    query = '''
    SELECT *
    FROM article
    JOIN user ON article.author_id = user.id
    WHERE user.api_key = ? and article.id = ?;
    '''
    try:
        article = query_db(query, (user_token, article_id), one=True)
        if not article:
            return jsonify("This is not your article!"), 403
        else:
            return jsonify("This is your article!"), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/details', methods=['GET'])
@cross_origin()
def get_article_by_id():
    article_id = request.args.get('id')

    query = '''
    select a.title, a.contents, a.create_date, u.id as author_id, u.name as author, (select count(*) from follow where followee_id = u.id) as num_of_followers
    from article a
    left join user u on u.id = a.author_id
    where a.id = ?
    '''
    try:
        article = query_db(query, (article_id,), one=True)
        if not article:
            return jsonify("This article doesn't exist!"), 404
        return jsonify({'title': article['title'],
                        'contents': article['contents'],
                        'create_date': article['create_date'],
                        'author': article['author'],
                        'author_id': article['author_id'],
                        'num_of_followers': article['num_of_followers']}), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/follow', methods=['POST'])
@cross_origin()
def follow():
    followee_id = request.json.get('followee_id')
    follower_id = request.json.get('follower_id')
    user_token = request.json.get('user_token')

    if not user_token:
        return jsonify("User token is required!"), 401

    query = '''
        insert into follow (follower_id, followee_id, create_time) values (?, ?, ?)
        '''
    try:
        query_db(query, (follower_id, followee_id, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")), one=True)
        return jsonify("Followed successfully!"), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/unfollow', methods=['DELETE'])
@cross_origin()
def unfollow():
    followee_id = request.json.get('followee_id')
    follower_id = request.json.get('follower_id')
    user_token = request.json.get('user_token')

    if not user_token:
        return jsonify("User token is required!"), 401

    query = "delete from follow where follower_id = ? and followee_id = ?"
    try:
        query_db(query, (follower_id, followee_id), one=True)
        return jsonify("Unfollowed successfully!"), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/new_article', methods=['POST'])
@cross_origin()
def publish_new_article():
    author = request.json.get('user_name')
    api_key = request.json.get('user_token')
    title = request.json.get('title')
    contents = request.json.get('contents')

    if not api_key:
        return jsonify("User token is required!"), 401

    query = '''
    INSERT INTO article (author_id, title, contents, create_date)
    SELECT u.id, ?, ?, ?
    FROM user u
    WHERE u.name = ?;
    '''
    try:
        query_db(query, (title, contents, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), author), one=True)

        query = '''
        select a.title, a.contents, a.create_date, u.id as author_id, u.name as author from article a
        left join user u on u.id = a.author_id
        where a.id = last_insert_rowid()
        '''
        article = query_db(query, (), one=True)

        return jsonify({'title': article['title'],
                        'contents': article['contents'],
                        'create_date': article['create_date'],
                        'author': article['author'],
                        'author_id': article['author_id']}), 200

    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/update_article', methods=['PUT'])
@cross_origin()
def update_article():
    author = request.json.get('author')
    api_key = request.json.get('api_key')
    title = request.json.get('title')
    contents = request.json.get('contents')
    article_id = request.json.get('article_id')

    if not api_key:
        return jsonify("User token is required!"), 401
    if not title:
        query = "update article set contents = ?, create_date = ? where id = ?"
        try:
            query_db(query, (contents, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), article_id), one=True)
            return jsonify("success!"), 200
        except Exception as e:
            return jsonify("Internal server error: ", str(e)), 500

    elif not contents:
        query = "update article set title = ?, create_date = ? where id = ?"
        try:
            query_db(query, (title, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), article_id), one=True)
            return jsonify("success!"), 200
        except Exception as e:
            return jsonify("Internal server error: ", str(e)), 500
    else:
        query = "update article set title = ?, contents = ?, create_date = ? where id = ?"
        try:
            query_db(query, (title, contents, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), article_id),
                     one=True)
            return jsonify("success!"), 200
        except Exception as e:
            return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/delete_article', methods=['DELETE'])
@cross_origin()
def delete_article():
    article_id = request.json.get('article_id')
    user_token = request.json.get('user_token')

    if not user_token:
        return jsonify("User token is required!"), 401

    query = 'delete from article where id=?'

    try:
        query_db(query, (article_id,), one=True)
        return jsonify("Deleted article successfully!"), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


@app.route('/api/userinfo', methods=['GET'])
@cross_origin()
def get_userinfo_by_name():
    author = request.args.get('name')

    query = '''
    SELECT u.id as id, u.name AS name, u.bio as bio, COUNT(DISTINCT f.id) AS num_of_followers, COUNT(DISTINCT a.id) AS num_of_articles FROM
    user AS u
    LEFT JOIN follow AS f ON u.id = f.followee_id
    LEFT JOIN article AS a ON u.id = a.author_id
    WHERE u.name = ?;
    '''
    try:
        user = query_db(query, (author,), one=True)
        if not user:
            return jsonify("This user doesn't exist!"), 404

        form = {'id': user['id'],
                'name': user['name'],
                'user_bio': user['bio'],
                'num_of_followers': user['num_of_followers'],
                'num_of_articles': user['num_of_articles']}

        # get the accounts that this account is following
        query = '''
        select followee_id as user_id, u.name as followee_name from follow
        left join main.user u on u.id = follow.followee_id
        where follower_id = ?
        '''
        result = query_db(query, (user['id'],), one=False)
        accounts_following = [dict(r) for r in result] if result else []
        form['accounts_following'] = accounts_following

        # get the most recent follower
        query = '''
        select follower_id as user_id, u.name as follower_name from follow
        left join main.user u on u.id = follow.follower_id
        where followee_id = ?
        order by follow.create_time desc limit 1
        '''
        result = query_db(query, (user['id'],), one=False)
        latest_follower = [dict(r) for r in result] if result else []
        form['latest_follower'] = latest_follower

        return jsonify(form), 200
    except Exception as e:
        return jsonify("Internal server error: ", str(e)), 500


if __name__ == '__main__':
    app.run()
