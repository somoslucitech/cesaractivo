-- Administradores, invitaciones y sesiones del panel.
-- Hasta ahora la aplicacion no tenia ningun concepto de usuario: el unico
-- punto del sistema con inicio de sesion es el panel de administracion.
--
-- Las fechas van en INTEGER (epoch ms) y no en TEXT ISO como la tabla leads.
-- Es deliberado: el codigo de autenticacion se replica tal cual del panel de
-- anhellakids, que ya esta probado en produccion sobre este mismo stack, y
-- reescribirlo para unificar el formato arriesgaria romperlo. Cualquier
-- consulta que cruce estas tablas con leads debe convertir explicitamente.

CREATE TABLE admins (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  avatar_url    TEXT,
  google_sub    TEXT UNIQUE,
  role          TEXT NOT NULL CHECK (role IN ('owner', 'admin')) DEFAULT 'admin',
  status        TEXT NOT NULL CHECK (status IN ('activo', 'suspendido')) DEFAULT 'activo',
  invited_by    TEXT REFERENCES admins(id),
  created_at    INTEGER NOT NULL,
  last_login_at INTEGER
);

CREATE TABLE admin_invitations (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  token_hash  TEXT NOT NULL UNIQUE,
  invited_by  TEXT NOT NULL REFERENCES admins(id),
  expires_at  INTEGER NOT NULL,
  accepted_at INTEGER,
  revoked_at  INTEGER,
  created_at  INTEGER NOT NULL
);
CREATE INDEX idx_admin_invitations_email ON admin_invitations(email);

CREATE TABLE sessions (
  id         TEXT PRIMARY KEY,
  admin_id   TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  ip         TEXT,
  user_agent TEXT
);
CREATE INDEX idx_sessions_admin ON sessions(admin_id);
