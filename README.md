# ScoutSeek 🎵

A full-stack music platform built with Spring Boot + React.

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Spring Boot 3.2, Java 17            |
| Security  | Spring Security + JWT               |
| Database  | MySQL 8 (port 3312)                 |
| Frontend  | React 18 + Vite (port 5173)         |
| Styling   | Custom CSS (dark Spotify-like theme)|

---

## Features

- User register / login with JWT authentication
- USER vs ADMIN role system
- Music library with pagination
- In-browser audio player with queue, skip, volume
- Advanced search: title, multiple artists, multiple genres, duration range
- Playlist management: create, delete, add/remove songs
- Play event tracking + analytics (top songs / artists / genres)
- Profile page with personal listening stats
- Admin panel: upload songs, manage artists & genres

---

## Setup Instructions

### 1. Database

Open MySQL Workbench (or CLI) connected to:
- Host: 127.0.0.1
- Port: 3312
- User: root

Run the file: `database.sql`

This creates the database, all tables, indexes, and a default ADMIN user:
- Email: `admin@scoutseek.com`
- Password: `admin123`

---

### 2. Backend

Requirements: Java 17, Maven

```bash
cd backend
mvn spring-boot:run
```

Backend runs at: http://localhost:9191

Uploaded files are saved to: `backend/uploads/`

---

### 3. Frontend

Requirements: Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Summary

| Method | Endpoint                          | Auth      | Description              |
|--------|-----------------------------------|-----------|--------------------------|
| POST   | /api/auth/register                | Public    | Register new user        |
| POST   | /api/auth/login                   | Public    | Login, get JWT token     |
| GET    | /api/songs?page=0&size=20         | Public    | Get paginated songs      |
| GET    | /api/songs/search                 | Public    | Advanced search          |
| POST   | /api/songs                        | ADMIN     | Upload song (multipart)  |
| DELETE | /api/songs/{id}                   | ADMIN     | Delete song              |
| GET    | /api/artists                      | Public    | List all artists         |
| POST   | /api/artists                      | ADMIN     | Create artist            |
| GET    | /api/genres                       | Public    | List all genres          |
| POST   | /api/genres                       | ADMIN     | Create genre             |
| GET    | /api/playlists                    | USER      | Get my playlists         |
| POST   | /api/playlists                    | USER      | Create playlist          |
| POST   | /api/playlists/{id}/songs/{songId}| USER      | Add song to playlist     |
| DELETE | /api/playlists/{id}/songs/{songId}| USER      | Remove song from playlist|
| DELETE | /api/playlists/{id}               | USER      | Delete playlist          |
| POST   | /api/analytics/play               | USER      | Record a song play       |
| GET    | /api/analytics/me                 | USER      | My analytics             |
| GET    | /api/analytics/global             | USER      | Global analytics         |

---

## Default Admin Login

```
Email:    admin@scoutseek.com
Password: admin123
```

Use Admin Panel → Artists → Add artists first, then Genres, then upload songs.

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
├── frontend/
│   └── src/
│       ├── api/             Axios client + all API functions
│       ├── components/      Sidebar, PlayerBar, SongRow, Toast
│       ├── context/         AuthContext, PlayerContext
│       ├── hooks/           useToast
│       └── pages/           Auth, Home, Library, Search, Playlists,
│                            Analytics, Profile, Admin
└── database.sql
```
