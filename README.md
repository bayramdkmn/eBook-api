# eBook Backend API

Bu proje, e-kitap platformu için Node.js/Express.js tabanlı bir backend API'sidir.

## Özellikler

- Kullanıcı yönetimi (kayıt, giriş, profil)
- Kitap yönetimi ve arama
- Kitap değişim sistemi
- Kullanıcı gönderileri (posts)
- Takip sistemi
- Kütüphane ve randevu sistemi
- Dilek listesi
- JWT tabanlı kimlik doğrulama

## Teknolojiler

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (JSON Web Tokens)
- bcrypt (şifreleme)
- Mailjet (e-posta servisi)

## API Endpoints

### Kullanıcı
- `POST /api/user/register` - Kullanıcı kaydı
- `POST /api/user/login` - Kullanıcı girişi
- `GET /api/user/profile` - Profil bilgileri

### Kitaplar
- `GET /api/books` - Tüm kitaplar
- `POST /api/books` - Yeni kitap ekleme
- `GET /api/books/:id` - Kitap detayı

### Diğer Endpoints
- `/api/userPosts` - Kullanıcı gönderileri
- `/api/follow` - Takip sistemi
- `/api/swapRequest` - Kitap değişim talepleri
- `/api/library` - Kütüphane sistemi
- `/api/appointment` - Randevu sistemi
- `/api/wishBooks` - Dilek listesi
- `/api/readingBooks` - Okunan kitaplar

## Proje Yapısı


## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
