import type { MovieCard } from '@lib/types';

export class MovieExtractor {
    static async extractByTitle(title: string): Promise<Partial<MovieCard>> {
        try {
            const movieData = await this.searchMovie(title);

            return {
                type: 'movie',
                title: movieData.title,
                description: movieData.overview,
                metadata: {
                    tmdbId: movieData.id,
                    imdbId: movieData.imdbId,
                    poster: movieData.poster,
                    backdrop: movieData.backdrop,
                    rating: movieData.rating,
                    genres: movieData.genres,
                    runtime: movieData.runtime,
                    releaseDate: movieData.releaseDate,
                    trailer: movieData.trailer,
                    watchStatus: undefined,
                },
                category: 'entertainment',
                color: '#f59e0b',
            };
        } catch (error) {
            console.error('Movie extraction failed:', error);
            throw error;
        }
    }

    private static async searchMovie(title: string): Promise<any> {
        // Mock data - replace with TMDB API
        return {
            id: 550,
            imdbId: 'tt0137523',
            title: 'Fight Club',
            overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
            poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
            backdrop: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
            rating: 8.4,
            genres: ['Drama', 'Thriller'],
            runtime: 139,
            releaseDate: '1999-10-15',
            trailer: 'https://www.youtube.com/watch?v=SUXWAEX2jlg',
        };
    }
}
