# Server X-Detect Capstone C23-PC603

### Team Member

**(ML) M121DKX4633** – Dzaky Abdillah Salafy – UIN Sultan Syarif Kasim Riau

**(ML) M260DSX2594** – Ahmad Habib Rizqi – Universitas Muhammadiyah Yogyakarta

**(ML) M194DKX4708** – Akhmad Nur Fadhil – Universitas Islam Negeri Sultan Aji Muhammad Idris Samarinda

**(CC) C038DSX0604** – Farhan Aly Hasbi – Institut Teknologi Sepuluh Nopember

**(CC) C254DSX0785** – Rizal Nawang Pradana – Universitas Muhammadiyah Semarang

**(MD) A304DSY1205** – Zainatul Sirti – Universitas Pembangunan Nasional Veteran Jakarta

# ENDPOINTS

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /Users        |
| POST   | /Signup       |
| POST   | /Signin       |
| DELETE | /Signout      |
| PATCH  | /Profile      |
| POST   | /upload       |
| GET    | /History      |
| GET    | /History/{id} |

<hr>

## <b>GET /Users </b>

Mendapatkan semua data user

Request body: tidak ada

Response :
Array user objects

<hr>

## <b>POST /Signup </b>

Melakukan pendaftaran ke aplikasi

Request body:

```json
{
  "name": "nama_user",
  "email": "email_user",
  "phone": "nomor_telepon_user",
  "password": "password_user"
}
```

Response jika sign-up berhasil:

```json
{
  "success": true,
  "msg": "Berhasil SignUp, silakan SignIn"
}
```

Response jika username sudah digunakan:

```json
{
  "success": false,
  "msg": "Username sudah digunakan"
}
```

## <b>POST /Signin </b>

Dilakukan untuk login ke aplikasi dan melakukan autentikasi

Request body:

```json
{
  "name": "nama_user",
  "password": "password_user"
}
```

Response jika sign-in berhasil:

```json
{
  "success": true,
  "msg": "Berhasil Login",
  "data": {
    "userId": "id_user",
    "name": "nama_user",
    "phone": "nomor_telepon_user",
    "email": "email_user",
    "image_url": "url_gambar",
    "accessToken": "access_token"
  }
}
```

Response jika password salah:

```json
{
  "success": false,
  "msg": "Password Anda Salah"
}
```

Response jika username tidak ditemukan:

```json
{
  "success": false,
  "msg": "Username Tidak Ditemukan"
}
```

<hr>

## <b>DELETE /Signout <b>

User melakukan logout dari aplikasi

Request Body: Tidak memerlukan request body.

Response jika sign-out berhasil:

```json
{
  "msg": "Sign out berhasil"
}
```

## <b>PATCH /Profile <b>

Untuk melakukan perubahan terhadap profile akun pengguna aplikasi

Request Body:

```json
{
  "name": "nama_user",
  "email": "email_user",
  "phone": "nomor_telepon_user",
  "password": "password_user"
}
```

Response jika profile berhasil diupdate:

```json
{
  "success": true,
  "msg": "Profile Berhasil Diupdate"
}
```

Response jika access token tidak ada:

```json
{
  "msg": "Access token tidak ada"
}
```

Response jika access token tidak ada:

```json
{
  "msg": "User tidak ditemukan"
}
```

## <b>POST /upload <b>

Untuk melakukan perubahan terhadap profile akun pengguna aplikasi

Request Body: Multipart form data dengan field image yang berisi file gambar.

```json
{
  "image": "example.jpg"
}
```

Response jika berhasil: akan mengupload gambar dan menjalankan deteksi penyakit kemudian mengembalikan Array of history objects.

Response jika tidak ada gambar yang diupload:

```json
{
  "msg": "Tidak Ada Gambar"
}
```

Response jika terjadi error saat mengunggah gambar:

```json
{
  "msg": "Error uploading image: error_message"
}
```

Response jika terjadi kesalahan menambahkan data history:

```json
{
  "msg": "Error adding history data: error_message"
}
```

Response jika Berhasil melakukan upload dan deteksi:

```json
{
  "msg": "Masih Dikembangkan"
}
```

## <b>GET /History <b>

Mendapatkan semua data history deteksi berdasarkan userId

Response jika terdapat data history

```json
{
  "id": 1,
  "id_user": 1,
  "image_url": "https://example.com",
  "title": "lore ipsum",
  "response": "lorem"
}
```

## <b>GET /History/{id} <b>

Mendapatkan detail data history deteksi berdasarkan userId dan historyId

Response jika terdapat data history

```json
{
  "id": 1,
  "id_user": 1,
  "image_url": "https://example.com",
  "title": "lore ipsum",
  "response": "lorem"
}
```
