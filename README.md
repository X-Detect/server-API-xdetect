# Server X-Detect Capstone C23-PC603

## Team Member

**(ML) M121DKX4633** – Dzaky Abdillah Salafy – UIN Sultan Syarif Kasim Riau

**(ML) M260DSX2594** – Ahmad Habib Rizqi – Universitas Muhammadiyah Yogyakarta

**(ML) M194DKX4708** – Akhmad Nur Fadhil – Universitas Islam Negeri Sultan Aji Muhammad Idris Samarinda

**(CC) C038DSX0604** – Farhan Aly Hasbi – Institut Teknologi Sepuluh Nopember

**(CC) C254DSX0785** – Rizal Nawang Pradana – Universitas Muhammadiyah Semarang

**(MD) A304DSY1205** – Zainatul Sirti – Universitas Pembangunan Nasional Veteran Jakarta

# API Documentation

This document provides information on how to use the API endpoints and their functionalities.

# Setup Project
To run this project, install it locally using npm on your pc
```
# clone repository
$ git clone https://github.com/X-Detect/server-API-xdetect.git

# change directory to server-API-xdetect
$ cd server-API-xdetect
```
Please go to Google Cloud Console and create a service account with permissions for both Storage Object Admin and Storage Object Viewer

### Configure your .env
```
- Change configuration with your database (this app using Firebase) : 
    API_KEY=<YOUR_PRIVATE_KEY>
    AUTH_DOMAIN=<YOUR_PRIVATE_KEY>
    PROJECT_ID=<YOUR_PRIVATE_KEY>
    STORAGE_BUCKET=<YOUR_PRIVATE_KEY>
    MESSAGING_SENDER_ID=<YOUR_PRIVATE_KEY>
    APP_ID=<YOUR_PRIVATE_KEY>
    GOOGLE_CLOUD_PROJECT=<YOUR_CLOUD_PROJECT>
    GOOGLE_APPLICATION_CREDENTIALS=<YOUR_PATH_TO_SERVICE_ACCOUNT>
```
### Create folder called db-config
This folder is used to store 2 file including firebase-config.js and serviceAccount.json. Use serviceAccount.json from Google Cloud Project
```
- Change configuration with your database (this app using Firebase) : 
    API_KEY=<YOUR_PRIVATE_KEY>
    AUTH_DOMAIN=<YOUR_PRIVATE_KEY>
    PROJECT_ID=<YOUR_PRIVATE_KEY>
    STORAGE_BUCKET=<YOUR_PRIVATE_KEY>
    MESSAGING_SENDER_ID=<YOUR_PRIVATE_KEY>
    APP_ID=<YOUR_PRIVATE_KEY>
    GOOGLE_CLOUD_PROJECT=<YOUR_CLOUD_PROJECT>
    GOOGLE_APPLICATION_CREDENTIALS=<YOUR_PATH_TO_SERVICE_ACCOUNT>
```
### Configure Node Module
```
# in server-API-xdetect

# install all depencencies using `npm install`

# run the backend using `npm start` or if you want to use dev environment you can hit `npm run dev`
```

## Recap Endpoint Routes
| Route                           | HTTP Method | Description                                  |
|---------------------------------|-------------|----------------------------------------------|
| /signup                         | POST        | Sign up a new user                           |
| /signin                         | POST        | Sign in a user                               |
| /signout                        | POST        | Sign out a user                              |
| /reset-password                 | POST        | Reset user's password                         |
| /users                          | GET         | Get all users                                |
| /users/:uid                     | GET         | Get user by UID                              |
| /upload-profile-picture         | POST        | Upload a profile picture for a user           |
| /upload/:uid                    | PUT         | Upload a profile picture with UID             |
| /predict                        | POST        | Perform a prediction using an uploaded image  |
| /article                        | POST        | Post a new article                            |
| /article                        | GET         | Get all articles                             |
| /article/:uid                   | GET         | Get an article by UID                         |


## Endpoints

### POST /signup

Create a new user account.

#### Request

- Method: POST
- Path: /signup
- Body Parameters:
```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
```

#### Response

- Success (HTTP 200):
  - success (boolean): `true`
  - msg (string): "Berhasil SignUp, silakan SignIn"

- Failure (HTTP 400):
  - success (boolean): `false`
  - msg (string): "Email sudah terdaftar"

### POST /signin

Authenticate and sign in a user.

#### Request

- Method: POST
- Path: /signin
- Body Parameters:
```json
{
  "email": "johndoe@example.com",
  "password": "password123"
}
```

#### Response

- Success (HTTP 200):
  - success (boolean): `true`
  - msg (string): "Berhasil Sign In"
  - data (object):
    - uid (string): User's unique ID.
    - email (string): User's email address.

- Failure (HTTP 404):
  - success (boolean): `false`
  - msg (string): "Error melakukan Sign In"

### POST /reset-password

Send a password reset email to the user.

#### Request

- Method: POST
- Path: /reset-password
- Body Parameters:
```json
{
  "email": "johndoe@example.com"
}

```

#### Response

- Success (HTTP 200):
  - msg (string): "Link Reset Password Telah Dikirim Ke Email"

- Failure (HTTP 200):
  - msg (string): "Error melakukan reset password"

### POST /Signout

Sign out the currently authenticated user.

#### Request

- Method: POST
- Path: /Signout

#### Response

- Success (HTTP 200):
  - msg (string): "Sign out Berhasil"

- Failure (HTTP 500):
  - msg (string): "Gagal Melakukan Sign Out"

### POST /predict

Upload an image file for prediction.

#### Request

- Method: POST
- Path: /predict
- Body Parameters:
  - image (file): Image file to be uploaded.

#### Response

- Success (HTTP 200):
  - status (string): "Success"
  - message (string): "Profile picture berhasil ditambahkan"
  - fileName (string): Name of the uploaded file.
  - url (string): Public URL of the uploaded file.
  - file (file): JSON file containing additional information.

### POST /upload-profile-picture

Upload a profile picture image file.

#### Request

- Method: POST
- Path: /upload-profile-picture
- Body Parameters:
  - image (file): Image file to be uploaded.

#### Response

- Success (HTTP 200):
  - status (string): "Success"
  - message (string): "Profile picture berhasil ditambahkan"
  - fileName (string): Name of the uploaded file.
  - url (string): Public URL of the uploaded file.
  - file (file): JSON file containing additional information.

### POST /upload/:uid

Upload a profile picture image file for a specific user.

#### Request

- Method: POST
- Path: /upload/:uid
- Body Parameters:
  - image (file): Image file to be uploaded.
  - uid (string): User's unique ID.
- Route Parameters:
  - uid (string): User's unique ID.

#### Response

- Success (HTTP 200):
  - status (string): "Success"
  - message (string): "Profile picture berhasil ditambahkan"
  - fileName (string): Name of the uploaded file.
  - url (string): Public URL of the uploaded file.
  - file (file): JSON file containing additional information.

### POST /post-article

Create and posting new artikel

#### Request
- Method: POST
- Path: /article
- Body Parameters:
```json
{
  "imageURL": "https://example.com/image.jpg",
  "title": "Judul Artikel",
  "description": "Deskripsi artikel",
  "createdBy": "John Doe",
  "content": "Isi artikel...",
  "sourceURL": "https://example.com/article"
}
```

#### Response
- Success (HTTP 200):
  - success (boolean): true
  - msg (string): "Berhasil"
- Failure (HTTP 400):
  - success (boolean): false
  - msg (string): "Field berikut harus diisi: [field1, field2, ...]"
- Error (HTTP 500):
  - success (boolean): false
  - msg (string): "Terjadi kesalahan, tunggu beberapa saat"

### GET /article
- Method: GET
- Path: /article
- Body Parameters: none

#### Response

- Success (HTTP 200):
  - success (boolean): true
  - msg (string): "Berhasil"
- Error (HTTP 500):
  - success (boolean): false
  - log : Error getting articles
  - msg (string): "Terjadi kesalahan, tunggu beberapa saat"

#### Example JSON Data Response
```json
{
  "success": true,
  "msg": "Berhasil",
  "data": [
    {
      "id": "xdetect-article-abc",
      "imageURL": "https://example.com/image.jpg",
      "title": "Judul Artikel",
      "description": "Deskripsi artikel",
      "createdBy": "John Doe",
      "createdAt": "June 10, 2023 10:00 AM",
      "content": "Isi artikel...",
      "sourceURL": "https://example.com/article"
    },
    {
      "id": "xdetect-article-def",
      "imageURL": "https://example.com/image2.jpg",
      "title": "Judul Artikel 2",
      "description": "Deskripsi artikel 2",
      "createdBy": "Jane Smith",
      "createdAt": "June 9, 2023 2:30 PM",
      "content": "Isi artikel 2...",
      "sourceURL": "https://example.com/article2"
    }
  ]
}
```

### GET /article/:uid
- Method: POST
- Path: /article/:uid
- Route Parameters:
  - uid (string): Articles's unique ID.

#### Response

- Success (HTTP 200):
  - success (boolean): true
  - msg (string): "Berhasil"
  - data (object): Data artikel yang ditemukan
- Not Found (HTTP 404):
  - success (boolean): false
  - msg (string): "Artikel tidak ditemukan"
- Error (HTTP 500):
  - success (boolean): false
  - msg (string): "Terjadi kesalahan, tunggu beberapa saat"

#### Example JSON Data Response
```json
{
  "success": true,
  "msg": "Berhasil",
  "data": {
    "id": "xdetect-article-abc",
    "imageURL": "https://example.com/image.jpg",
    "title": "Judul Artikel",
    "description": "Deskripsi artikel",
    "createdBy": "John Doe",
    "createdAt": "June 10, 2023 10:00 AM",
    "content": "Isi artikel...",
    "sourceURL": "https://example.com/article"
  }
}
```

### GET /users
This endpoint is used to retrieve a list of users.

- Method: GET
- Path: /users
- Body Parameters: No parameters are required.

#### Response

- Success (HTTP 200):
  - success (boolean): true
  - msg (string): "Berhasil"
- Error (HTTP 500):
  - success (boolean): false
  - log : Error getting articles
  - msg (string): "Terjadi kesalahan, tunggu beberapa saat"

#### Example JSON Data Response
```json
{
    "success": true,
    "msg": "Success",
    "data": [
        {
            "id": "1",
            "name": "John Doe",
            "email": "johndoe@example.com"
        },
        {
            "id": "2",
            "name": "Jane Smith",
            "email": "janesmith@example.com"
        }
    ]
}
```

### GET /users/:uid
- Method: GET
- Path: /users/:uid
- Route Parameters:
  - uid (string): The User ID (UID) of the user to retrieve.

- Example Request: GET /users/alkdmfoIY12kfjb

#### Response

- Success (HTTP 200):
  - success (boolean): true
  - msg (string): "Berhasil"
  - data (object): Data user yang ditemukan
- Not Found (HTTP 404):
  - success (boolean): false
  - msg (string): "User tidak ditemukan"
- Error (HTTP 500):
  - success (boolean): false
  - msg (string): "Terjadi kesalahan, tunggu beberapa saat"

#### Example JSON Data Response
```json
{
    "success": true,
    "msg": "Success",
    "data": {
        "id": "1",
        "name": "John Doe",
        "email": "johndoe@example.com"
    }
}
```


