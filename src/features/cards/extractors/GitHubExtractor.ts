import type { GitHubCard } from '@lib/types';
import { getGithubToken } from '@lib/constants';

interface GitHubRepoData {
    owner: string;
    repo: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    license?: string;
    topics?: string[];
    avatar?: string;
    readme?: string;
}

interface GitHubApiResponse {
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    license: { spdx_id: string } | null;
    topics: string[];
    owner: { avatar_url: string; login: string };
}

export class GitHubExtractor {
    static async extract(url: string): Promise<Partial<GitHubCard>> {
        const match = url.match(/github\.com\/([\w-]+)\/([\w-]+)/);
        if (!match) throw new Error('Invalid GitHub URL');

        const [, owner, repo] = match;

        try {
            const data = await this.fetchRepoData(owner, repo);

            return {
                type: 'github',
                title: `${owner}/${repo}`,
                description: data.description,
                url,
                metadata: {
                    owner: data.owner,
                    repo: data.repo,
                    description: data.description,
                    language: data.language,
                    stars: data.stars,
                    forks: data.forks,
                    license: data.license,
                    topics: data.topics,
                    avatar: data.avatar,
                    readme: data.readme,
                },
                tags: data.topics,
                category: 'development',
            };
        } catch (error) {
            console.error('GitHub extraction failed:', error);
            // Fallback: basic card without metadata
            return {
                type: 'github',
                title: `${owner}/${repo}`,
                url,
                metadata: {
                    owner,
                    repo,
                    description: '',
                    language: '',
                    stars: 0,
                    forks: 0
                },
            };
        }
    }

    private static async fetchRepoData(owner: string, repo: string): Promise<GitHubRepoData> {
        const token = await getGithubToken();
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers,
        });

        // Private repo or not found
        if (response.status === 404 || response.status === 403) {
            throw new Error('Repository not accessible');
        }

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data: GitHubApiResponse = await response.json();

        return {
            owner: data.owner.login,
            repo: data.name,
            description: data.description || '',
            language: data.language || '',
            stars: data.stargazers_count,
            forks: data.forks_count,
            license: data.license?.spdx_id,
            topics: data.topics || [],
            avatar: data.owner.avatar_url,
        };
    }
}
