import { ipcMain } from 'electron';
import { getDatabase } from '../database';
import type { Workspace } from '../types';

export function setupWorkspaceHandlers(): void {
    ipcMain.handle('workspaces:create', (_event, workspace: Workspace) => {
        const db = getDatabase();
        const stmt = db.prepare(`
      INSERT INTO workspaces (id, name, type, color, icon, description, pinned, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        stmt.run(
            workspace.id,
            workspace.name,
            workspace.type,
            workspace.color,
            workspace.icon || null,
            workspace.description || null,
            workspace.pinned ? 1 : 0,
            workspace.createdAt,
            workspace.updatedAt
        );

        return workspace;
    });

    ipcMain.handle('workspaces:findById', (_event, id: string) => {
        const db = getDatabase();
        const stmt = db.prepare('SELECT * FROM workspaces WHERE id = ?');
        const row = stmt.get(id) as any;
        return row ? mapRowToWorkspace(row) : null;
    });

    ipcMain.handle('workspaces:findAll', () => {
        const db = getDatabase();
        const stmt = db.prepare('SELECT * FROM workspaces ORDER BY pinned DESC, created_at ASC');
        const rows = stmt.all() as any[];
        return rows.map(mapRowToWorkspace);
    });

    ipcMain.handle('workspaces:update', (_event, id: string, updates: Partial<Workspace>) => {
        const db = getDatabase();
        const fields: string[] = [];
        const values: any[] = [];

        Object.entries(updates).forEach(([key, value]) => {
            if (key === 'id' || key === 'createdAt') return;

            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            fields.push(`${dbKey} = ?`);

            if (typeof value === 'boolean') {
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
            `UPDATE workspaces SET ${fields.join(', ')} WHERE id = ?`
        );
        stmt.run(...values);
    });

    ipcMain.handle('workspaces:delete', (_event, id: string) => {
        const db = getDatabase();
        const stmt = db.prepare('DELETE FROM workspaces WHERE id = ?');
        stmt.run(id);
    });
}

function mapRowToWorkspace(row: any): Workspace {
    return {
        id: row.id,
        name: row.name,
        type: row.type,
        color: row.color,
        icon: row.icon,
        description: row.description,
        pinned: row.pinned === 1,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
