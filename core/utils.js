export function formatDate(date) {
    if (!date) return 'TBA';
    const options = { month: 'long', year: 'numeric' };
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
