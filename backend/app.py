from dataclasses import fields
from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
from uuid import uuid4
import os
import datetime
import redis

load_dotenv()

app = Flask(__name__)

CORS(app, supports_credentials=True)

#APP CONFIG
app.config['SECRET_KEY'] = os.environ["SECRET_KEY"]
app.config['SQLALCHEMY_DATABASE_URI'] = r"sqlite:///./db.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url('redis://127.0.0.1:6379')

bcrypt = Bcrypt(app)
server_session = Session(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)

#GET HEX
def get_uuid():
    return uuid4().hex

#DATABASE MODELS
class Users(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100))
    email = db.Column(db.String(345))
    password = db.Column(db.Text, nullable=False)
    wishlists = db.relationship("Wishlist", backref="users")

class Wishlist(db.Model):
    __tablename__ = "wishlist"
    user_id = db.Column(db.String(32), db.ForeignKey("users.user_id"), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    author = db.Column(db.String(20))
    year = db.Column(db.String(4))
    genre = db.Column(db.String(30))
    publisher = db.Column(db.String(30))
    description = db.Column(db.Text())
    date = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, user_id, title, author, year, genre, publisher, description):  
        self.user_id = user_id
        self.title = title
        self.author = author
        self.year = year
        self.genre = genre
        self.publisher = publisher
        self.description = description

class WishlistSchema(ma.Schema):
    class Meta:
        fields = ('user_id', 'id', 'title', 'author', 'year', 'genre', 'publisher', 'description', 'date')

wishlist_schema = WishlistSchema()
wishlists_schema = WishlistSchema(many=True)

class Books(db.Model):
    __tablename__ = "books"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    author = db.Column(db.String(20))
    year = db.Column(db.String(4))
    genre = db.Column(db.String(30))
    publisher = db.Column(db.String(30))
    description = db.Column(db.Text())
    date = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, title, author, year, genre, publisher, description):  
        self.title = title
        self.author = author
        self.year = year
        self.genre = genre
        self.publisher = publisher
        self.description = description

class BookSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'author', 'year', 'genre', 'publisher', 'description', 'date')

book_schema = BookSchema()
books_schema = BookSchema(many=True)


#ROUTES
@app.route('/')
def get_pages():
    return ({"Hello":"World"})

@app.route('/register', methods = ['POST'])
def register_user():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

    user_exists = Users.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "user already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)

    user = Users(name=name, email=email, password=hashed_password)

    db.session.add(user)
    db.session.commit()

    session["c_user_id"] = user.user_id

    return jsonify({
        "name": user.name,
        "email": user.email
    })

@app.route('/signin', methods = ['POST'])
def signin_user():
    email = request.json['email']
    password = request.json['password']

    user = Users.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["c_user_id"] = user.user_id

    return jsonify({
        "name": user.name,
        "email": user.email
    })

@app.route('/@me')
def get_current_user():
    current_user_id = session.get("c_user_id")

    if not current_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = Users.query.filter_by(user_id=current_user_id).first()

    return jsonify({
        "user_id": current_user_id,
        "name": user.name,
        "email": user.email
    })

@app.route('/logout', methods = ['POST'])
def logout_user():
    session.pop("c_user_id")
    return "200"

@app.route('/add', methods = ['POST'])
def add_books():
    title = request.json['title']
    author = request.json['author']
    year = request.json['year']
    genre = request.json['genre']
    publisher = request.json['publisher']
    description = request.json['description']

    books = Books(title, author, year, genre, publisher, description)

    db.session.add(books)
    db.session.commit()

    return book_schema.jsonify(books)

@app.route('/get', methods = ['GET'])
def get_books():
    all_books = Books.query.all()
    results = books_schema.dump(all_books)

    return jsonify(results)


@app.route('/get/<id>/', methods = ['GET'])
def get_book(id):
    book = Books.query.get(id)

    return book_schema.jsonify(book)

@app.route('/update/<id>/', methods = ['PUT'])
def update_books(id):
    book = Books.query.get(id)

    title = request.json['title']
    author = request.json['author']
    year = request.json['year']
    genre = request.json['genre']
    publisher = request.json['publisher']
    description = request.json['description']

    book.title = title
    book.author = author
    book.year = year
    book.genre = genre
    book.publisher = publisher
    book.description = description

    db.session.commit()

    return book_schema.jsonify(book)

@app.route('/delete/<id>/', methods = ['DELETE'])
def delete_books(id):
    book = Books.query.get(id)

    db.session.delete(book)
    db.session.commit()

    return book_schema.jsonify(book)

@app.route('/search', methods = ['POST'])
def search_books():
    search = request.json['search']

    result = Books.query.filter(Books.title.contains(search) | Books.author.contains(search) | Books.genre.contains(search))
    
    return books_schema.jsonify(result)

@app.route('/getwishlist', methods = ['GET'])
def get_wishlists():
    current_user_id = session.get("c_user_id")

    wishlist = Wishlist.query.filter_by(user_id=current_user_id)
    
    return wishlists_schema.jsonify(wishlist)

@app.route('/getwishlist/<id>/', methods = ['GET'])
def get_wishlist(id):
    wishlist = Wishlist.query.get(id)

    return wishlists_schema.jsonify(wishlist)

@app.route('/addwishlist', methods = ['POST'])
def add_wishlist():
    current_user_id = session.get("c_user_id")

    title = request.json['title']
    author = request.json['author']
    year = request.json['year']
    genre = request.json['genre']
    publisher = request.json['publisher']
    description = request.json['description']

    wishlist = Wishlist(current_user_id, title, author, year, genre, publisher, description)

    if not current_user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    db.session.add(wishlist)
    db.session.commit()
    return wishlist_schema.jsonify(wishlist)

@app.route('/deletewishlist/<id>/', methods = ['DELETE'])
def delete_wishlist(id):
    wishlist = Wishlist.query.get(id)

    db.session.delete(wishlist)
    db.session.commit()

    return wishlist_schema.jsonify(wishlist)

if __name__ == "_main_":
    app.run(debug=True)