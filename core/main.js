import { GameService } from './gameService.js';
import { GameRenderer } from './gameRenderer.js';

const gameService = new GameService('games.json');
const gameRenderer = new GameRenderer('gameList');

async function initialize() {
    const games = await gameService.fetchGames();
    gameRenderer.renderGames(games);

    const searchInput = document.getElementById('searchInput');
    const gameFilter = document.getElementById('gameFilter');

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const filter = gameFilter.value.toLowerCase();

        const filteredGames = games.filter((game) => {
            const matchesFilter = filter === 'all' || game.status.toLowerCase().includes(filter);
            const matchesSearch = game.title.toLowerCase().includes(searchTerm);
            return matchesFilter && matchesSearch;
        });

        gameRenderer.renderGames(filteredGames);
    }

    searchInput.addEventListener('input', applyFilters);
    gameFilter.addEventListener('change', applyFilters);
}

initialize();
