/**
 * Generate sample data for FloatNote
 * Run: node scripts/generate-sample-data.js
 */

const sampleCards = [
    // GitHub Cards
    {
        type: 'github',
        title: 'Electron',
        description: 'Build cross-platform desktop apps with JavaScript, HTML, and CSS',
        url: 'https://github.com/electron/electron',
        category: 'Development',
        tags: ['desktop', 'electron', 'javascript'],
        favorite: true,
    },
    {
        type: 'github',
        title: 'React',
        description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces',
        url: 'https://github.com/facebook/react',
        category: 'Development',
        tags: ['frontend', 'react', 'javascript'],
        favorite: true,
    },

    // YouTube Cards
    {
        type: 'youtube',
        title: 'Electron Crash Course',
        description: 'Learn Electron JS in this full tutorial',
        url: 'https://youtube.com/watch?v=example1',
        category: 'Learning',
        tags: ['tutorial', 'electron', 'video'],
    },
    {
        type: 'youtube',
        title: 'React Hooks Explained',
        description: 'Complete guide to React Hooks',
        url: 'https://youtube.com/watch?v=example2',
        category: 'Learning',
        tags: ['tutorial', 'react', 'hooks'],
    },

    // Movie Cards
    {
        type: 'movie',
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology',
        category: 'Entertainment',
        tags: ['scifi', 'thriller', 'nolan'],
        favorite: true,
    },
    {
        type: 'movie',
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space',
        category: 'Entertainment',
        tags: ['scifi', 'space', 'nolan'],
    },

    // Spotify Cards
    {
        type: 'spotify',
        title: 'Bohemian Rhapsody',
        description: 'Queen - A Night at the Opera',
        url: 'https://open.spotify.com/track/example1',
        category: 'Music',
        tags: ['rock', 'classic', 'queen'],
        favorite: true,
    },

    // Note Cards
    {
        type: 'note',
        title: 'Project Ideas',
        content: `
# Web App Ideas

## E-commerce Platform
- Multi-vendor marketplace
- Real-time inventory
- AI recommendations

## Social Network
- Privacy-focused
- Decentralized
- End-to-end encryption

## Productivity Tool
- Time tracking
- Task management
- Team collaboration
        `,
        category: 'Ideas',
        tags: ['brainstorm', 'projects', 'startup'],
    },
    {
        type: 'note',
        title: 'Meeting Notes - Q1 Planning',
        content: `
# Q1 Planning Meeting
Date: 2024-01-15

## Attendees
- John (PM)
- Sarah (Dev)
- Mike (Design)

## Key Points
1. New feature rollout
2. Performance improvements
3. User feedback review

## Action Items
- [ ] Create feature spec
- [ ] Design mockups
- [ ] Setup testing environment
        `,
        category: 'Work',
        tags: ['meeting', 'planning', 'q1'],
    },
    {
        type: 'note',
        title: 'Reading List',
        content: `
# Books to Read

## Technical
- Clean Code - Robert Martin
- Design Patterns - Gang of Four
- The Pragmatic Programmer

## Business
- Zero to One - Peter Thiel
- The Lean Startup - Eric Ries
- Measure What Matters - John Doerr

## Personal
- Atomic Habits - James Clear
- Deep Work - Cal Newport
        `,
        category: 'Personal',
        tags: ['books', 'learning', 'reading'],
    },

    // Website Cards
    {
        type: 'website',
        title: 'MDN Web Docs',
        description: 'Resources for developers, by developers',
        url: 'https://developer.mozilla.org',
        category: 'Development',
        tags: ['docs', 'web', 'reference'],
        favorite: true,
    },
    {
        type: 'website',
        title: 'CSS-Tricks',
        description: 'Daily articles about CSS, HTML, JavaScript, and all things related to web design',
        url: 'https://css-tricks.com',
        category: 'Development',
        tags: ['css', 'frontend', 'blog'],
    },
    {
        type: 'website',
        title: 'Hacker News',
        description: 'A social news website focusing on computer science and entrepreneurship',
        url: 'https://news.ycombinator.com',
        category: 'News',
        tags: ['tech', 'news', 'community'],
    },
];

const sampleWorkspaces = [
    {
        name: 'Personal',
        color: '#6366f1',
        description: 'Personal projects and interests',
    },
    {
        name: 'Work',
        color: '#ec4899',
        description: 'Work-related content',
    },
    {
        name: 'Learning',
        color: '#f59e0b',
        description: 'Courses, tutorials, and educational content',
    },
    {
        name: 'Entertainment',
        color: '#8b5cf6',
        description: 'Movies, music, and fun stuff',
    },
];

// Export for use in application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sampleCards,
        sampleWorkspaces,
    };
}

console.log('✅ Sample data generated:');
console.log(`   ${sampleCards.length} cards`);
console.log(`   ${sampleWorkspaces.length} workspaces`);
console.log('\nCard types:');
const cardCounts = sampleCards.reduce((acc, card) => {
    acc[card.type] = (acc[card.type] || 0) + 1;
    return acc;
}, {});
Object.entries(cardCounts).forEach(([type, count]) => {
    console.log(`   - ${type}: ${count}`);
});
