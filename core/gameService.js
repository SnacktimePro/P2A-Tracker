export class GameService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async fetchGames() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Failed to fetch game data');
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }
}
