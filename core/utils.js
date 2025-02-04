export function formatDate(date) {
    if (!date) return 'TBA'; // Return 'TBA' if the date is not provided
    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }; // Full date format
    return new Date(date).toLocaleDateString('en-US', options);
}

export function getTwitterProfileImage(twitterUrl) {
    const usernameMatch = twitterUrl?.match(/x\.com\/([a-zA-Z0-9_]+)/);
    if (usernameMatch && usernameMatch[1]) {
        const username = usernameMatch[1];
        return `https://unavatar.io/twitter/${username}`;
    }
    return null;
}
