# FINDMYITEM — Team Division (6 members)

We work in **one shared GitHub repo**. Everyone is added as a collaborator and
pushes commits under their **own** GitHub account, so every member has a real,
visible contribution history. Work happens on **feature branches → Pull Requests
→ merge into `main`**.

## Ownership map

Each member owns a coherent full-stack-ish slice. "Owns" = primary author and
reviewer for that area; small cross-edits are fine via PRs.

| # | Member | Area | Backend files | Frontend files |
|---|--------|------|---------------|----------------|
| 1 | _____ | **Auth & Accounts** | `backend/accounts/**` | `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/context/AuthContext.jsx`, `src/components/ProtectedRoute.jsx` |
| 2 | _____ | **Items API (backend core)** | `backend/items/models.py`, `serializers.py`, `views.py`, `permissions.py`, `urls.py`, `admin.py`, `migrations/**`, `tests.py` | — |
| 3 | _____ | **Items UI: browse, detail, dashboard** | — | `src/pages/Home.jsx`, `src/pages/ItemDetail.jsx`, `src/pages/Dashboard.jsx`, `src/components/ItemCard.jsx` |
| 4 | _____ | **Report item, map & media upload** | image-upload config, `backend/items/management/commands/seed.py` | `src/pages/ReportItem.jsx`, `src/components/MapPicker.jsx` |
| 5 | _____ | **Messaging / real-time chat** | `backend/messaging/**` (models, consumers, routing, middleware, serializers, views) | `src/pages/Messages.jsx`, `src/components/Avatar.jsx` |
| 6 | _____ | **Core config, API client, layout & docs** | `backend/findmyitem/**` (settings, urls, pagination, asgi/wsgi), `requirements.txt` | `src/api/client.js`, `src/main.jsx`, `src/App.jsx`, `vite.config.js`, `src/components/Navbar.jsx`, `src/components/BottomNav.jsx`, `README.md`, Postman collection |

> Fill in the names, then each person works only inside their files to avoid
> merge conflicts. When you must touch someone else's file, do it in a small PR
> and ask them to review.

## One-time setup (done by the repo owner)

1. Create an **empty** repo on GitHub (no README/gitignore — we already have them).
2. From this folder:
   ```bash
   git remote add origin https://github.com/<owner>/findmyitem.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Collaborators → Add people**, invite the other 5 by
   their GitHub username. They accept the email invite.

## Everyday workflow (each member)

```bash
# first time only — clone the shared repo
git clone https://github.com/<owner>/findmyitem.git
cd findmyitem

# set YOUR identity so commits show under your account
git config user.name  "Your Name"
git config user.email "your-github-email@example.com"

# for every new piece of work
git checkout main
git pull origin main            # get latest before starting
git checkout -b feature/<area>-<short-desc>   # e.g. feature/auth-login-form
# ... make changes in YOUR files ...
git add -A
git git add .
git push -u origin feature/auth-login-form
```

Then open a **Pull Request** on GitHub, get one teammate to review, and merge
into `main`. Delete the branch after merge.

## Rules of the road

- **Never push straight to `main`** — always branch + PR.
- **Pull `main` before starting** new work and before opening a PR.
- Keep PRs small and inside your own area to minimize conflicts.
- Don't commit secrets: `backend/.env`, `db.sqlite3`, `node_modules/`, and
  `frontend/dist/` are already git-ignored.
