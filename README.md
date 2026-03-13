# ScoutSeek 🎵

A full-stack music platform built with **Spring Boot + React** that allows users to discover, stream, and manage music while tracking listening analytics.

---

## Tech Stack

| Layer    | Technology                           |
| -------- | ------------------------------------ |
| Backend  | Spring Boot 3.2, Java 17             |
| Security | Spring Security + JWT                |
| Database | MySQL 8 (port 3312)                  |
| Frontend | React 18 + Vite (port 5173)          |
| Styling  | Custom CSS (dark Spotify-like theme) |

---

## Features

* User registration & login using **JWT authentication**
* **Role-based authorization** (USER / ADMIN)
* Music library with **pagination**
* **In-browser audio player** with queue, skip, and volume control
* **Advanced search** by title, multiple artists, multiple genres, and duration range
* **Playlist management** (create, delete, add/remove songs)
* **Play event tracking** with analytics
* Personal **listening statistics dashboard**
* **Admin panel** for uploading songs and managing artists & genres

---

## Architecture

Frontend (React + Vite)
↓
REST API (Spring Boot)
↓
Spring Security + JWT Authentication
↓
MySQL Database

---

## Setup Instructions

### 1. Database

Open **MySQL Workbench** (or CLI) and connect using:

Host: `127.0.0.1`
Port: `3312`
User: `root`

Run the file:

```
database.sql
```

This will create:

* All required tables
* Database indexes
* Default admin user

Admin credentials can be modified in `database.sql`.

---

### 2. Backend

Requirements:

* Java 17
* Maven

Run:

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:9191
```

Uploaded audio files are stored in:

```
backend/uploads/
```

---

### 3. Frontend

Requirements:

* Node.js 18+

Run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## API Summary

| Method | Endpoint                           | Auth   | Description           |
| ------ | ---------------------------------- | ------ | --------------------- |
| POST   | /api/auth/register                 | Public | Register new user     |
| POST   | /api/auth/login                    | Public | Login and receive JWT |
| GET    | /api/songs?page=0&size=20          | Public | Get paginated songs   |
| GET    | /api/songs/search                  | Public | Advanced search       |
| POST   | /api/songs                         | ADMIN  | Upload song           |
| DELETE | /api/songs/{id}                    | ADMIN  | Delete song           |
| GET    | /api/artists                       | Public | List artists          |
| POST   | /api/artists                       | ADMIN  | Create artist         |
| GET    | /api/genres                        | Public | List genres           |
| POST   | /api/genres                        | ADMIN  | Create genre          |
| GET    | /api/playlists                     | USER   | Get user playlists    |
| POST   | /api/playlists                     | USER   | Create playlist       |
| POST   | /api/playlists/{id}/songs/{songId} | USER   | Add song to playlist  |
| DELETE | /api/playlists/{id}/songs/{songId} | USER   | Remove song           |
| DELETE | /api/playlists/{id}                | USER   | Delete playlist       |
| POST   | /api/analytics/play                | USER   | Record song play      |
| GET    | /api/analytics/me                  | USER   | Personal analytics    |
| GET    | /api/analytics/global              | USER   | Global analytics      |

---

## Using the Admin Panel

To upload songs:

1. Login as an **ADMIN**
2. Go to **Admin Panel**
3. Add **Artists**
4. Add **Genres**
5. Upload songs

---

## Project Structure

```
scoutseek/
├── backend/
│   ├── src/main/java/com/scoutseek/
│   │   ├── config/          SecurityConfig, WebConfig
│   │   ├── controller/      Auth, Song, Artist, Genre, Playlist, Analytics
│   │   ├── dto/             Request/Response DTOs
│   │   ├── exception/       GlobalExceptionHandler
│   │   ├── model/           User, Song, Artist, Genre, Playlist, PlayHistory
│   │   ├── repository/      JPA repositories with custom queries
│   │   ├── security/        JwtUtil, JwtFilter
│   │   └── service/         Auth, Song, Playlist, Analytics services
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   └── src/
│       ├── api/             Axios client + API functions
│       ├── components/      Sidebar, PlayerBar, SongRow, Toast
│       ├── context/         AuthContext, PlayerContext
│       ├── hooks/           useToast
│       └── pages/           Auth, Home, Library, Search, Playlists,
│                            Analytics, Profile, Admin
│
└── database.sql
```

---

## Analytics System

ScoutSeek records every **song play event** and generates insights such as:

* Most played songs
* Most played artists
* Most popular genres
* Personal listening statistics per user

---

## Key Backend Concepts Demonstrated

* REST API design
* JWT authentication
* Role-based authorization
* Pagination
* Advanced search queries
* Event tracking analytics
* DTO pattern
* Global exception handling
* Service-layer architecture

---

## Deployment (Planned)

Frontend → Vercel
Backend → Render
Database → Railway MySQL

---

## Author

Praneeth Reddy
Full-stack developer passionate about backend systems and scalable applications.
