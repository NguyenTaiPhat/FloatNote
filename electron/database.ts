import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

let db: Database.Database | null = null;

export function initDatabase(): void {
  const isDev = !app.isPackaged;
  const dbPath = isDev
    ? path.join(process.cwd(), 'floatnote.db')
    : path.join(app.getPath('userData'), 'floatnote.db');

  db = new Database(dbPath);

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL');

  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT,
      url TEXT,
      metadata TEXT,
      tags TEXT,
      category TEXT,
      color TEXT,
      favorite INTEGER DEFAULT 0,
      archived INTEGER DEFAULT 0,
      workspace_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_cards_type ON cards(type);
    CREATE INDEX IF NOT EXISTS idx_cards_workspace ON cards(workspace_id);
    CREATE INDEX IF NOT EXISTS idx_cards_favorite ON cards(favorite);
    CREATE INDEX IF NOT EXISTS idx_cards_created ON cards(created_at DESC);

    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      color TEXT NOT NULL,
      icon TEXT,
      description TEXT,
      pinned INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_workspaces_pinned ON workspaces(pinned DESC, created_at DESC);

    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      source_card_id TEXT NOT NULL,
      target_card_id TEXT NOT NULL,
      type TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (source_card_id) REFERENCES cards(id) ON DELETE CASCADE,
      FOREIGN KEY (target_card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_card_id);
    CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_card_id);

    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      card_id TEXT NOT NULL,
      action TEXT NOT NULL,
      snapshot TEXT,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_history_card ON history(card_id);
    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp DESC);

    CREATE TABLE IF NOT EXISTS widgets (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      card_id TEXT,
      position_x REAL NOT NULL,
      position_y REAL NOT NULL,
      width REAL NOT NULL,
      height REAL NOT NULL,
      mode TEXT DEFAULT 'normal',
      opacity REAL DEFAULT 1.0,
      always_on_top INTEGER DEFAULT 1,
      settings TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Migration: Add pinned column to existing workspaces table
  try {
    const tableInfo = db.prepare('PRAGMA table_info(workspaces)').all() as any[];
    const hasPinned = tableInfo.some((col: any) => col.name === 'pinned');

    if (!hasPinned) {
      console.log('Adding pinned column to workspaces table...');
      db.exec('ALTER TABLE workspaces ADD COLUMN pinned INTEGER DEFAULT 0');
      db.exec('CREATE INDEX IF NOT EXISTS idx_workspaces_pinned ON workspaces(pinned DESC, created_at DESC)');
      console.log('Migration completed: pinned column added');
    }
  } catch (error) {
    console.error('Migration error:', error);
  }

  console.log('Database initialized at:', dbPath);
}

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
