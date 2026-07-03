import type { Card, Workspace } from '@lib/types';

export class ExportManager {
    static exportToJSON(cards: Card[], workspaces: Workspace[]): string {
        const data = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            cards,
            workspaces,
        };
        return JSON.stringify(data, null, 2);
    }

    static exportToMarkdown(cards: Card[]): string {
        const locale = localStorage.getItem('locale') || 'en';
        const localeMap: Record<string, string> = {
            en: 'en-US',
            vi: 'vi-VN',
            zh: 'zh-CN',
            ja: 'ja-JP',
        };

        let markdown = '# FloatNote Export\n\n';
        markdown += `Exported: ${new Date().toLocaleString(localeMap[locale])}\n\n`;

        cards.forEach(card => {
            markdown += `## ${card.title}\n\n`;

            if (card.description) {
                markdown += `${card.description}\n\n`;
            }

            if (card.content) {
                markdown += `${card.content}\n\n`;
            }

            if (card.url) {
                markdown += `**URL:** ${card.url}\n\n`;
            }

            if (card.tags && card.tags.length > 0) {
                markdown += `**Tags:** ${card.tags.join(', ')}\n\n`;
            }

            markdown += `**Type:** ${card.type} | **Created:** ${new Date(card.createdAt).toLocaleDateString(localeMap[locale])}\n\n`;
            markdown += '---\n\n';
        });

        return markdown;
    }

    static async exportAsFile(content: string, filename: string, type: 'json' | 'markdown') {
        const blob = new Blob([content], {
            type: type === 'json' ? 'application/json' : 'text/markdown'
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    static importFromJSON(jsonString: string): { cards: Card[]; workspaces: Workspace[] } {
        const data = JSON.parse(jsonString);
        return {
            cards: data.cards || [],
            workspaces: data.workspaces || [],
        };
    }
}
