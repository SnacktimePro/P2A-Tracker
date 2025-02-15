import { formatDate, getTwitterProfileImage } from './utils.js';

export class GameRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.STATUS_ORDER = Object.freeze({
            ongoing: 0,
            upcoming: 1,
            ended: 2,
        });
        this.BUTTON_CONFIGS = {
            default: { text: 'Play Now', class: 'btn btn-primary' },
            claim: { text: 'Claim Airdrop', class: 'btn btn-secondary' },
        };
    }

    renderGames(games) {
        if (!Array.isArray(games)) {
            throw new Error('Games parameter must be an array');
        }

        this.container.innerHTML = '';
        const now = new Date();

        games
            .map((game) => ({ ...game, status: this.updateGameStatus(game, now) }))
            .sort((a, b) => this.STATUS_ORDER[a.status] - this.STATUS_ORDER[b.status])
            .forEach((game) => this.renderGameCard(game));
    }

    renderGameCard(game) {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';

        const twitterLink = game.social_links?.find((link) => link.platform.toLowerCase() === 'twitter')?.url;
        const media = twitterLink ? getTwitterProfileImage(twitterLink) : null;

        gameCard.innerHTML = `
            ${this.generateMediaHTML(media)}
            ${this.generateGameInfoHTML(game)}
            ${this.generateDatesHTML(game)}
            ${this.generateButtonHTML(game)}
            ${this.generateSocialLinksHTML(game.social_links)}
        `;

        this.handleMediaLoad(media, gameCard, game.title);
        this.container.appendChild(gameCard);
    }

    generateMediaHTML(media) {
        return media
            ? `
            <div class="media-container">
                <div class="image-placeholder">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
            </div>`
            : '';
    }

    generateGameInfoHTML(game) {
        return `
            <h3>${game.title}</h3>
            <span class="status-badge ${game.status.toLowerCase()}">
                ${this.getStatusBadge(game.status)}
            </span>
            <p class="description">${game.description || 'No description available.'}</p>`;
    }

    generateDatesHTML(game) {
        return `
            <div class="date-info">
                <div class="date-container">
                    <span class="date-icon"><i class="fas fa-calendar-day"></i></span>
                    <span class="date-label">Start:</span>
                    <span class="date-value start">${formatDate(game.start)}</span>
                </div>
                <div class="date-container">
                    <span class="date-icon"><i class="fas fa-calendar-check"></i></span>
                    <span class="date-label">End:</span>
                    <span class="date-value end">${formatDate(game.end)}</span>
                </div>
            </div>`;
    }

    generateButtonHTML(game) {
        const config =
            game.claim_url && game.status === 'ended' ? this.BUTTON_CONFIGS.claim : this.BUTTON_CONFIGS.default;
        const url = game.claim_url && game.status === 'ended' ? game.claim_url : game.url;

        return url
            ? `
            <div class="button-container">
                <a href="${url}" class="${config.class}" target="_blank" rel="noopener noreferrer">
                    ${config.text}
                </a>
            </div>`
            : '';
    }

    generateSocialLinksHTML(socialLinks) {
        if (!socialLinks?.length) return '';

        return `
            <div class="social-links">
                ${socialLinks
                    .map(
                        (link) => `
                    <a href="${link.url}" target="_blank">
                        <i class="fab fa-${link.platform.toLowerCase()}"></i> ${link.platform}
                    </a>
                `
                    )
                    .join('')}
            </div>`;
    }

    handleMediaLoad(media, gameCard, title) {
        if (!media) return;

        const img = new Image();
        img.src = media;
        img.alt = title;

        img.onload = () => {
            const placeholder = gameCard.querySelector('.image-placeholder');
            placeholder?.replaceWith(img);
        };

        img.onerror = () => {
            const placeholder = gameCard.querySelector('.image-placeholder');
            if (placeholder) {
                placeholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            }
        };
    }

    updateGameStatus(game, now) {
        if (!game.start) return 'upcoming'; // If no start date, it's upcoming

        const startDate = new Date(game.start);
        if (isNaN(startDate.getTime())) return 'upcoming'; // Handle invalid start dates

        const endDate = game.end ? new Date(game.end) : null;

        switch (true) {
            case now < startDate:
                return 'upcoming';
            case endDate && now > endDate:
                return 'ended';
            default:
                return 'ongoing';
        }
    }

    getStatusBadge(status) {
        switch (status.toLowerCase()) {
            case 'ongoing':
                return '🟢 Ongoing';
            case 'upcoming':
                return '🟡 Upcoming';
            case 'ended':
                return '🔴 Ended';
            default:
                return 'Unknown';
        }
    }
}
