-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  created_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT,
  agreement_score REAL
);

-- Trials table (individual responses)
CREATE TABLE IF NOT EXISTS trials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  trial_number INTEGER NOT NULL,
  left_face TEXT NOT NULL,
  right_face TEXT NOT NULL,
  selected_face TEXT NOT NULL,
  response_time_ms INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

-- Face statistics (aggregate data)
CREATE TABLE IF NOT EXISTS face_stats (
  face_id TEXT PRIMARY KEY,
  times_shown INTEGER DEFAULT 0,
  times_selected INTEGER DEFAULT 0
);

-- Initialize face_stats for all 46 faces
INSERT OR IGNORE INTO face_stats (face_id, times_shown, times_selected) VALUES
  ('face_01', 0, 0), ('face_02', 0, 0), ('face_03', 0, 0), ('face_04', 0, 0),
  ('face_05', 0, 0), ('face_06', 0, 0), ('face_07', 0, 0), ('face_08', 0, 0),
  ('face_09', 0, 0), ('face_10', 0, 0), ('face_11', 0, 0), ('face_12', 0, 0),
  ('face_13', 0, 0), ('face_14', 0, 0), ('face_15', 0, 0), ('face_16', 0, 0),
  ('face_17', 0, 0), ('face_18', 0, 0), ('face_19', 0, 0), ('face_20', 0, 0),
  ('face_21', 0, 0), ('face_22', 0, 0), ('face_23', 0, 0), ('face_24', 0, 0),
  ('face_25', 0, 0), ('face_26', 0, 0), ('face_27', 0, 0), ('face_28', 0, 0),
  ('face_29', 0, 0), ('face_30', 0, 0), ('face_31', 0, 0), ('face_32', 0, 0),
  ('face_33', 0, 0), ('face_34', 0, 0), ('face_35', 0, 0), ('face_36', 0, 0),
  ('face_37', 0, 0), ('face_38', 0, 0), ('face_39', 0, 0), ('face_40', 0, 0),
  ('face_41', 0, 0), ('face_42', 0, 0), ('face_43', 0, 0), ('face_44', 0, 0),
  ('face_45', 0, 0), ('face_46', 0, 0);

-- Index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_trials_session ON trials(session_id);
