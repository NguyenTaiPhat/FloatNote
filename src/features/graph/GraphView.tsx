import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useCardStore } from '@/store';
import { Card as CardType } from '@lib/types';
import { IconButton } from '@shared/IconButton';
import { ZoomIn, ZoomOut, Maximize2, FileText, Github, Music, Film, Globe } from 'lucide-react';

interface Node {
    id: string;
    name: string;
    type: string;
    color: string;
    val: number;
    icon: string;
    image: string | null;
    card: CardType;
}

interface Link {
    source: string;
    target: string;
    strength: number;
}

export function GraphView() {
    const { cards } = useCardStore();
    const graphRef = useRef<any>();
    const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });

    useEffect(() => {
        const nodes: Node[] = cards.map(card => ({
            id: card.id,
            name: card.title,
            type: card.type,
            color: getColorByType(card.type),
            val: card.favorite ? 15 : 10,
            icon: getIconByType(card.type),
            image: loadCardImage(card),
            card: card,
        }));

        // Preload images for nodes
        nodes.forEach(node => {
            if (node.image) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = node.image;
                img.onload = () => {
                    (node as any)._imageObj = img;
                };
            }
        });

        const links: Link[] = [];

        // Generate sample relationships based on tags and categories
        cards.forEach((card, i) => {
            cards.slice(i + 1).forEach(otherCard => {
                if (hasRelationship(card, otherCard)) {
                    links.push({
                        source: card.id,
                        target: otherCard.id,
                        strength: calculateStrength(card, otherCard),
                    });
                }
            });
        });

        setGraphData({ nodes, links });
    }, [cards]);

    const getColorByType = (type: string): string => {
        const colors: Record<string, string> = {
            note: '#3b82f6',
            github: '#333333',
            youtube: '#FF0000',
            spotify: '#1DB954',
            movie: '#f59e0b',
            website: '#6366f1',
        };
        return colors[type] || '#3b82f6';
    };

    const getIconByType = (type: string): string => {
        const icons: Record<string, string> = {
            note: '📝',
            github: '🐙', // GitHub Octocat emoji as fallback
            youtube: '▶️',
            spotify: '🎵',
            movie: '🎬',
            website: '🌐',
        };
        return icons[type] || '📄';
    };

    const loadCardImage = (card: CardType): string | null => {
        // Use card-specific images when available
        if (card.type === 'github' && card.metadata?.avatar) {
            return card.metadata.avatar as string;
        }
        if (card.type === 'youtube' && card.metadata?.thumbnail) {
            return card.metadata.thumbnail as string;
        }
        if (card.type === 'movie' && card.metadata?.poster) {
            return card.metadata.poster as string;
        }
        if (card.type === 'spotify' && (card.metadata as any)?.cover) {
            return (card.metadata as any).cover;
        }
        if (card.type === 'website' && card.metadata?.favicon) {
            return card.metadata.favicon as string;
        }
        return null;
    };

    const hasRelationship = (card1: CardType, card2: CardType): boolean => {
        // Same category
        if (card1.category === card2.category) return true;

        // Shared tags
        const tags1 = card1.tags || [];
        const tags2 = card2.tags || [];
        if (tags1.some(tag => tags2.includes(tag))) return true;

        return false;
    };

    const calculateStrength = (card1: CardType, card2: CardType): number => {
        let strength = 0;

        if (card1.category === card2.category) strength += 0.5;

        const tags1 = card1.tags || [];
        const tags2 = card2.tags || [];
        const sharedTags = tags1.filter(tag => tags2.includes(tag));
        strength += sharedTags.length * 0.3;

        return Math.min(strength, 1);
    };

    const handleZoomIn = () => {
        if (graphRef.current) {
            graphRef.current.zoom(1.5, 400);
        }
    };

    const handleZoomOut = () => {
        if (graphRef.current) {
            graphRef.current.zoom(0.75, 400);
        }
    };

    const handleCenter = () => {
        if (graphRef.current) {
            graphRef.current.zoomToFit(400);
        }
    };

    return (
        <div className="relative w-full h-full bg-background rounded-2xl overflow-hidden">
            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <IconButton variant="default" size="md" onClick={handleZoomIn}>
                    <ZoomIn size={18} />
                </IconButton>
                <IconButton variant="default" size="md" onClick={handleZoomOut}>
                    <ZoomOut size={18} />
                </IconButton>
                <IconButton variant="default" size="md" onClick={handleCenter}>
                    <Maximize2 size={18} />
                </IconButton>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10 glass p-4 rounded-xl">
                <h3 className="text-xs font-semibold text-text-primary mb-2">Card Types</h3>
                <div className="space-y-1">
                    {['note', 'github', 'youtube', 'spotify', 'movie', 'website'].map(type => (
                        <div key={type} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getColorByType(type) }}
                            />
                            <span className="text-xs text-text-secondary capitalize">{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Graph */}
            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="name"
                nodeColor="color"
                nodeVal="val"
                linkWidth={link => (link as any).strength * 2}
                linkColor={() => 'rgba(255, 255, 255, 0.1)'}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                backgroundColor="#0a0a0a"
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    const size = node.val;

                    // Draw node background circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
                    ctx.fillStyle = node.color;
                    ctx.fill();

                    // Draw image if available
                    if (node.image && node._imageObj) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, size - 2, 0, 2 * Math.PI);
                        ctx.closePath();
                        ctx.clip();

                        const imgSize = (size - 2) * 2;
                        ctx.drawImage(
                            node._imageObj,
                            node.x - size + 2,
                            node.y - size + 2,
                            imgSize,
                            imgSize
                        );
                        ctx.restore();
                    } else {
                        // Draw SVG icon as fallback
                        const iconSize = size * 1.2;
                        ctx.fillStyle = '#ffffff';

                        if (node.type === 'note') {
                            // FileText icon - document with lines
                            const scale = iconSize / 24;
                            ctx.save();
                            ctx.translate(node.x - iconSize / 2, node.y - iconSize / 2);
                            ctx.scale(scale, scale);
                            ctx.strokeStyle = '#ffffff';
                            ctx.lineWidth = 2;
                            ctx.lineCap = 'round';
                            ctx.lineJoin = 'round';

                            // Document outline with folded corner
                            ctx.beginPath();
                            ctx.moveTo(4, 2);
                            ctx.lineTo(4, 22);
                            ctx.lineTo(20, 22);
                            ctx.lineTo(20, 8);
                            ctx.lineTo(14, 2);
                            ctx.closePath();
                            ctx.stroke();

                            // Folded corner
                            ctx.beginPath();
                            ctx.moveTo(14, 2);
                            ctx.lineTo(14, 8);
                            ctx.lineTo(20, 8);
                            ctx.stroke();

                            // Lines inside document
                            ctx.beginPath();
                            ctx.moveTo(8, 13);
                            ctx.lineTo(16, 13);
                            ctx.moveTo(8, 17);
                            ctx.lineTo(16, 17);
                            ctx.stroke();

                            ctx.restore();
                        } else if (node.type === 'github') {
                            // Circle icon for GitHub
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, iconSize * 0.4, 0, 2 * Math.PI);
                            ctx.fill();
                        } else if (node.type === 'youtube') {
                            // Play button triangle
                            ctx.beginPath();
                            ctx.moveTo(node.x - iconSize * 0.3, node.y - iconSize * 0.4);
                            ctx.lineTo(node.x - iconSize * 0.3, node.y + iconSize * 0.4);
                            ctx.lineTo(node.x + iconSize * 0.4, node.y);
                            ctx.closePath();
                            ctx.fill();
                        } else if (node.type === 'spotify' || node.type === 'music') {
                            // Musical note
                            ctx.beginPath();
                            ctx.arc(node.x, node.y + iconSize * 0.2, iconSize * 0.2, 0, 2 * Math.PI);
                            ctx.fill();
                            ctx.fillRect(node.x + iconSize * 0.15, node.y - iconSize * 0.4, 2, iconSize * 0.6);
                        } else if (node.type === 'movie') {
                            // Film strip icon
                            const w = iconSize * 0.7;
                            const h = iconSize * 0.5;
                            ctx.fillRect(node.x - w / 2, node.y - h / 2, w, h);
                        } else {
                            // Globe/Website - circle with line
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, iconSize * 0.4, 0, 2 * Math.PI);
                            ctx.stroke();
                            ctx.strokeStyle = '#ffffff';
                            ctx.lineWidth = 2;
                        }
                    }

                    // Draw label below node
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(label.length > 20 ? label.substring(0, 20) + '...' : label, node.x, node.y + size + fontSize);
                }}
                onNodeClick={(node: any) => {
                    console.log('Node clicked:', node);
                }}
            />
        </div>
    );
}
