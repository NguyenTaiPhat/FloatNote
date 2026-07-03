import { ipcMain } from 'electron';
import { getDatabase } from '../database';
import type { Card } from '../types';

export function setupCardHandlers(): void {
    ipcMain.handle('cards:create', (_event, card: Card) => {
        const db = getDatabase();
        const stmt = db.prepare(`
      INSERT INTO cards (
        id, type, title, description, content, url, metadata, tags,
        category, color, favorite, archived, workspace_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        stmt.run(
            card.id,
            card.type,
            card.title,
            card.description || null,
            card.content || null,
            card.url || null,
            card.metadata ? JSON.stringify(card.metadata) : null,
            card.tags ? JSON.stringify(card.tags) : null,
            card.category || null,
            card.color || null,
            card.favorite ? 1 : 0,
            card.archived ? 1 : 0,
            card.workspaceId || null,
            card.createdAt,
            card.updatedAt
        );

        return card;
    });

    ipcMain.handle('cards:findById', (_event, id: string) => {
        const db = getDatabase();
        const stmt = db.prepare('SELECT * FROM cards WHERE id = ?');
        const row = stmt.get(id) as any;
        return row ? mapRowToCard(row) : null;
    });

    ipcMain.handle('cards:findAll', (_event, filters?: {
        type?: string;
        workspaceId?: string;
        favorite?: boolean;
        archived?: boolean;
    }) => {
        const db = getDatabase();
        let query = 'SELECT * FROM cards WHERE 1=1';
        const params: any[] = [];

        if (filters?.type) {
            query += ' AND type = ?';
            params.push(filters.type);
        }
        if (filters?.workspaceId) {
            query += ' AND workspace_id = ?';
            params.push(filters.workspaceId);
        }
        if (filters?.favorite !== undefined) {
            query += ' AND favorite = ?';
            params.push(filters.favorite ? 1 : 0);
        }
        if (filters?.archived !== undefined) {
            query += ' AND archived = ?';
            params.push(filters.archived ? 1 : 0);
        }

        query += ' ORDER BY created_at DESC';

        const stmt = db.prepare(query);
        const rows = stmt.all(...params) as any[];
        return rows.map(mapRowToCard);
    });

    ipcMain.handle('cards:update', (_event, id: string, updates: Partial<Card>) => {
        const db = getDatabase();
        const fields: string[] = [];
        const values: any[] = [];

        Object.entries(updates).forEach(([key, value]) => {
            if (key === 'id' || key === 'createdAt') return;

            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            fields.push(`${dbKey} = ?`);

            if (key === 'metadata' || key === 'tags') {
                values.push(value ? JSON.stringify(value) : null);
            } else if (typeof value === 'boolean') {
                values.push(value ? 1 : 0);
            } else {
                values.push(value ?? null);
            }
        });

        if (fields.length === 0) return;

        fields.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(id);

        const stmt = db.prepare(
            `UPDATE cards SET ${fields.join(', ')} WHERE id = ?`
        );
        stmt.run(...values);
    });

    ipcMain.handle('cards:delete', (_event, id: string) => {
        const db = getDatabase();
        const stmt = db.prepare('DELETE FROM cards WHERE id = ?');
        stmt.run(id);
    });

    ipcMain.handle('cards:search', (_event, query: string) => {
        const db = getDatabase();
        const stmt = db.prepare(`
      SELECT * FROM cards 
      WHERE title LIKE ? OR description LIKE ? OR content LIKE ?
      ORDER BY created_at DESC
      LIMIT 50
    `);
        const searchTerm = `%${query}%`;
        const rows = stmt.all(searchTerm, searchTerm, searchTerm) as any[];
        return rows.map(mapRowToCard);
    });
}

function mapRowToCard(row: any): Card {
    return {
        id: row.id,
        type: row.type,
        title: row.title,
        description: row.description,
        content: row.content,
        url: row.url,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        tags: row.tags ? JSON.parse(row.tags) : undefined,
        category: row.category,
        color: row.color,
        favorite: row.favorite === 1,
        archived: row.archived === 1,
        workspaceId: row.workspace_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
