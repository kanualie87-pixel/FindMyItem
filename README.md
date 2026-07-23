# 🔎 FINDMYITEM — Campus Lost & Found

A full-stack lost-and-found platform. Users report lost or found items, browse
and search the board, claim items, and message each other in **real time** to
arrange a return. Admins have full control and are the **only** role allowed to
delete items.

- **Frontend:** React (Vite) + Tailwind CSS + React Router + Leaflet maps
- **Backend:** Django + Django REST Framework + Django Channels (WebSockets)
- **Database:** dbSQlite3 (relational, via the Django ORM — no raw SQL, so no
  SQL-injection risk)
- **Auth:** JWT (access + refresh tokens)

---

## ✨ Features

| Area                 | What it does                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------- |
| **Auth-first**       | The app opens on **Login / Register** — the navigation only appears **after** you log in.     |
| **Login / Register** | Sign up with a **profile picture** upload; JWT login.                                         |
| **Responsive**       | Standard **web** layout (top navigation) and **phone** layout (bottom tab bar).               |
| **Navbar**           | Top nav on desktop; a bottom tab bar (Home / Report / Chat / Dashboard) on mobile.            |
| **Home**             | Big central **search bar**, lost/found + category **filters**, gradient hero.                 |
| **ItemCard**         | Reusable card: image, **lost/found badge**, location, date.                                   |
| **Report Item**      | Image upload, category dropdown, **map picker** (click to drop a pin), free-text description. |
| **Item detail**      | Claim an item, or **message the owner** directly.                                             |
| **Messages**         | **Real-time chat** over WebSockets between two users.                                         |
| **Dashboard**        | Your posts + incoming/outgoing claims. Admins see **all** items and can delete.               |

---

## ✅ Assignment requirements — where they live

- **Relational DB (PostgreSQL):** `backend/findmyitem/settings.py` → `DATABASES`
- **Full CRUD on a main entity (`Item`):** `backend/items/views.py` (`ItemViewSet`)
- **RESTful routing / standard HTTP verbs:** `backend/items/urls.py` (DRF router)
- **ORM / parameterized queries (no SQL injection):** all models use the Django ORM
- **Only admin can delete; users cannot:** `backend/items/permissions.py`
  (`IsOwnerOrReadOnlyAndAdminDelete`)
- **Postman demo:** import `backend/FINDMYITEM.postman_collection.json`

---

## 🚀 Getting started

### Prerequisites

- Python 3.11+ (tested on 3.14) and Node.js 18+
- dbSQlite3 18 running locally

### 1. Backend

```bash
cd backend

# (a) Create the PostgreSQL database. In pgAdmin, or with psql:
#     "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE findmyitem;"

# (b) Put your Postgres password into the .env file:
#     open backend/.env and replace PLACEHOLDER_PUT_YOUR_POSTGRES_PASSWORD_HERE

# (c) Activate the virtual environment (already created)
venv\Scripts\activate        # Windows PowerShell/cmd
# source venv/bin/activate    # macOS/Linux

# (d) Install deps (already installed once; run again if needed)
pip install -r requirements.txt

# (e) Create the tables
python manage.py migrate

# (f) (optional) Load demo users + 20 items, each with a downloaded photo
python manage.py seed             # needs internet for the photos
# python manage.py seed --no-images   # faster / works offline (no pictures)
#   -> admin / admin123   (admin, can delete)
#   -> alice / alicepass123, bob / bobpass123, sara / sarapass123, daniel / danielpass123

# (g) Create your own admin (if you skipped seed)
python manage.py createsuperuser

# (h) Run the server (serves both the REST API and WebSockets)
python manage.py runserver
```

The API is now at **http://127.0.0.1:8000** and the Django admin at
**http://127.0.0.1:8000/admin/**.

### 2. Frontend

```bash
cd frontend
npm install        # already done once
npm run dev
```

Open **http://localhost:5173**.

---

## 🔌 API reference

Base URL: `http://127.0.0.1:8000/api`

### Auth

| Method    | Endpoint          | Description                                            |
| --------- | ----------------- | ------------------------------------------------------ |
| POST      | `/auth/register/` | Create account (multipart, supports `profile_picture`) |
| POST      | `/auth/login/`    | Get `access` + `refresh` tokens + user info            |
| POST      | `/auth/refresh/`  | Refresh the access token                               |
| GET/PATCH | `/auth/me/`       | Current user's profile                                 |

### Items — the main CRUD entity

| Method      | Endpoint              | Who                                        |
| ----------- | --------------------- | ------------------------------------------ | -------------------------------- |
| GET         | `/items/`             | Anyone (supports `?search=`, `?type=lost   | found`, `?category=`, `?mine=1`) |
| POST        | `/items/`             | Logged-in users                            |
| GET         | `/items/{id}/`        | Anyone                                     |
| PUT / PATCH | `/items/{id}/`        | Owner or admin                             |
| **DELETE**  | `/items/{id}/`        | **Admin only** (users get `403 Forbidden`) |
| GET         | `/items/{id}/claims/` | Owner or admin                             |

### Claims

| Method     | Endpoint                | Description                       |
| ---------- | ----------------------- | --------------------------------- |
| GET / POST | `/claims/`              | List your claims / create a claim |
| POST       | `/claims/{id}/respond/` | Owner approves/rejects a claim    |

### Messaging

| Method | Endpoint                                        | Description                  |
| ------ | ----------------------------------------------- | ---------------------------- |
| GET    | `/conversations/`                               | Your conversations           |
| POST   | `/conversations/start/`                         | Start/get a 1:1 conversation |
| GET    | `/conversations/{id}/messages/`                 | Message history              |
| POST   | `/messages/`                                    | Send a message (REST)        |
| WS     | `ws://127.0.0.1:8000/ws/chat/{id}/?token=<jwt>` | **Real-time** chat           |

---

## 🧪 Demonstrating CRUD in Postman

1. Import `backend/FINDMYITEM.postman_collection.json`.
2. Run **Auth → Login (admin)** — the JWT is saved automatically.
3. Run, in order: **CREATE → READ all → READ single → UPDATE (PUT) → UPDATE (PATCH) → DELETE**.
4. To prove the admin-only rule:
   - Run **Auth → Login (normal user - alice)**, then **DELETE** → `403 Forbidden`.
   - Run **Auth → Login (admin)**, then **DELETE** → `204 No Content`.

---

## 🗄️ Database schema (main tables)

- **User** — username, email, password (hashed), `profile_picture`, phone,student_id,department, role (admin/user), created_at
  `is_staff` (= admin).
- **Item** _(main entity)_ — `owner → User`, title, description, `item_type`
  (lost/found), category, location, latitude/longitude, image, status,date_lost_found,
  `date_event`, timestamps.
- **Claim** — `item → Item`, `claimant → User`, message, status.proof_ownership, message, status, created_at.
- **Conversation** — `participants ↔ User` (M2M), optional `item → Item, created_ate
- **Message** — `conversation → Conversation`, `sender → User`, text, is_read, sent_at
  
---

## 📝 Notes

- `backend/findmyitem/settings_test.py` is a throwaway SQLite config used only
  for quick local testing without a Postgres password — the graded/default
  configuration is **PostgreSQL** in `settings.py`.
- WebSockets use an in-memory channel layer, so **no Redis is required** for
  local development.

  ## Media Files

  Added media files to support the FindMyItem application.
