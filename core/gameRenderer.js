import { formatDate, getTwitterProfileImage } from './utils.js';

export class GameRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    renderGames(games) {
        this.container.innerHTML = ''; // Clear previous content

        // Sort the games array to prioritize ongoing games
        games.sort((a, b) => {
            if (a.status === 'ongoing' && b.status !== 'ongoing') return -1; // Ongoing first
            if (a.status !== 'ongoing' && b.status === 'ongoing') return 1;
            return 0; // Keep the rest as is
        });

        games.forEach((game) => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';

            const twitterLink = game.social_links?.find((link) => link.platform.toLowerCase() === 'twitter')?.url;
            const media = twitterLink ? getTwitterProfileImage(twitterLink) : null; // Only get media if Twitter link exists

            let gameHTML = `
                ${
                    media
                        ? `<div class="media-container">
                    <div class="image-placeholder">
                        <i class="fas fa-spinner fa-spin"></i> <!-- Font Awesome Spinner -->
                    </div>
                </div>`
                        : ''
                }
                <h3>${game.title}</h3>
                <span class="status-badge ${game.status.toLowerCase()}">
                    ${this.getStatusBadge(game.status)}
                </span>
                <p class="description">${game.description || 'No description available.'}</p>
                <div class="date-info">
                    <div class="date-container">
                        <span class="date-icon"><i class="fas fa-calendar-day"></i></span> <!-- Start Date Icon -->
                        <span class="date-label">Start:</span>
                        <span class="date-value start">${formatDate(game.start)}</span>
                    </div>
                    <div class="date-container">
                        <span class="date-icon"><i class="fas fa-calendar-check"></i></span> <!-- End Date Icon -->
                        <span class="date-label">End:</span>
                        <span class="date-value end">${formatDate(game.end)}</span> <!-- TBA Example -->
                    </div>
                </div>
            `;

            // Add buttons if URLs are present
            const buttons = [];
            if (game.url || game.claim_url) {
                buttons.push({
                    text: game.status === 'ended' ? 'Claim Airdrop' : 'Play Now',
                    classes: ['btn', `${game.status === 'ended' ? 'btn-secondary' : 'btn-primary'}`],
                    url: game.claim_url || game.url,
                });
            }

            if (buttons.length > 0) {
                const buttonsHTML = buttons
                    .map(
                        (button) => `
                            <a href="${button.url}" class="${button.classes.join(' ')}">${button.text}</a>
                        `
                    )
                    .join('');
                gameHTML += `<div class="button-container">${buttonsHTML}</div>`;
            }

            if (game.social_links) {
                gameHTML += `<div class="social-links">
                    ${game.social_links
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

            gameCard.innerHTML = gameHTML;

            // Add the image after rendering the card if media exists
            if (media) {
                const img = new Image();
                img.src = media;
                img.alt = `${game.title}`;
                img.onload = () => {
                    const placeholder = gameCard.querySelector('.image-placeholder');
                    placeholder.replaceWith(img); // Replace spinner with the loaded image
                };
                img.onerror = () => {
                    const placeholder = gameCard.querySelector('.image-placeholder');
                    placeholder.innerHTML = `<i class="fas fa-exclamation-triangle"></i>`; // Show error icon if failed to load
                };
            }

            this.container.appendChild(gameCard);
        });
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
