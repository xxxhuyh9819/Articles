# Articles

#### A full-stack (React-Vite-Redux-Flask-SQLite) web article posting platform 

### **How To Run**

Go to the backend directory and run the application at http://127.0.0.1:5000.

```
flask run
```

Go to the frontend directory and run:

```
yarn
yarn run dev
```

so that it runs at  http://localhost:5173

To try the app out, login with this username and password:

```
username: haha
password: haha
```

### Application Components
- Login/Register page
- Home page (list of articles)
- New Article page (publish a new article)
- Details page (the contents of details)
- Profile page (user name, number of articles, number of followers, etc.)
- Edit Profile page (update username, password, and bio)

### Application Features

- Used axios to manage REST API calls
- Used Redux to manage global states, such as user login information
- Used custom hooks to manage local states that needs to be persisted: Pagination, article display preferences, etc.
- Follow users: Users can follow/unfollow other users.
- Routing Authorization: Users that are not logged in are not authorized to follow users, modify user info, etc.
- Code organization: code are organized based on its functionalities: pages, APIs, Redux stores, etc.


### Application Functionalities

- Users can log in or create a new account to access the home page and update their username and password.
- User authentication: Users not logged in have no access to the home page and are instead directed to the login page.
- Users can join, leave, and create a channel.
- Users can post on a channel and reply to a post.
- Automatically refreshes channels and posts.

### **What I learned**

- Practiced the Flask and React frameworks
- Practiced fetching data via REST API calls with axios.
- Code organization
- Practiced different ways of managing state: useState, Redux, and custom hooks
- Improved understanding of user authentication.
- Further practiced building web pages with HTML and CSS 





