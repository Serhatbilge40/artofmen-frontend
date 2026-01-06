# Supabase Setup Anleitung

## 1. Supabase Projekt erstellen

1. Gehen Sie zu [supabase.com](https://supabase.com) und loggen Sie sich ein
2. Klicken Sie auf **"New Project"**
3. Wählen Sie eine Organisation und geben Sie einen Projektnamen ein
4. Wählen Sie eine Region (z.B. Frankfurt für DE)
5. Erstellen Sie ein Datenbank-Passwort (merken Sie sich dieses!)
6. Klicken Sie auf **"Create new project"**

## 2. Datenbank-Schema erstellen

1. Im Supabase Dashboard, gehen Sie zu **"SQL Editor"**
2. Klicken Sie auf **"New query"**
3. Kopieren Sie den Inhalt von `frontend/supabase-schema.sql` und fügen Sie ihn ein
4. Klicken Sie auf **"Run"**

## 3. API Keys kopieren

1. Gehen Sie zu **"Settings"** → **"API"**
2. Kopieren Sie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Environment Variables setzen

### Lokal (.env.local)
```bash
cd frontend
cp env.template .env.local
```

Bearbeiten Sie `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Vercel
1. Gehen Sie zu Ihrem Vercel Projekt
2. **Settings** → **Environment Variables**
3. Fügen Sie alle drei Variablen hinzu

## 5. Starten

```bash
cd frontend
npm run dev
```

## 6. Demo-Produkt hinzufügen

Das SQL-Schema enthält bereits ein Demo-Produkt. Sie können weitere über das Admin-Panel hinzufügen.

---

## RLS (Row Level Security) Hinweis

Die Datenbank verwendet RLS:
- **Öffentlich**: Nur veröffentlichte Produkte sind sichtbar
- **Admin**: Für volle CRUD-Rechte müssen Sie sich über Supabase Auth authentifizieren

Für Entwicklung können Sie RLS temporär deaktivieren:
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

⚠️ Aktivieren Sie RLS wieder vor dem Deployment!
