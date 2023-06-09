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

## Endpoints

### POST /Signup

Create a new user account.

#### Request

- Method: POST
- Path: /Signup
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

### POST /Signin

Authenticate and sign in a user.

#### Request

- Method: POST
- Path: /Signin
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

### POST /Resetpassword

Send a password reset email to the user.

#### Request

- Method: POST
- Path: /Resetpassword
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

### POST /Predict

Upload an image file for prediction.

#### Request

- Method: POST
- Path: /Predict
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
- Route Parameters:
  - uid (string): User's unique ID.

#### Response

- Success (HTTP 200):
  - status (string): "Success"
  - message (string): "Profile picture berhasil ditambahkan"
  - fileName (string): Name of the uploaded file.
  - url (string): Public URL of the uploaded file.
  - file (file): JSON file containing additional information.

