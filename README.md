## Django
The Django project is located in `/backend`.

### Requirements
`django`
`djangorestframework`
`django-cors-headers`

### Starting the Django Server
The django server can be started by doing the following from inside `/backend`:
```
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

This starts the server on port 8000 locally.
NOTE: The top 2 commands do not need to be run everytime. Only when there has been a change to the models or views in the backend!

## React
The React project is located in `/frontend`

### Install Dependencies
Run `npm install` from insdie `/frontend` to install all dependencies

### Starting the frontend
Run `npm start` to start the react project on port 3000 locally.

NOTE: Currently due to some CORS issues, use `127.0.0.1:3000` in the browser until I sort it.
