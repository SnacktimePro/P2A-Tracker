export function formatDate(date) {
    const parsedDate = new Date(date);
    if (!date || isNaN(parsedDate.getTime())) return 'TBA'; // Return 'TBA' if the date is invalid

    const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    return parsedDate.toLocaleDateString('en-US', options);
}

export function getTwitterProfileImage(twitterUrl) {
    const usernameMatch = twitterUrl?.match(/x\.com\/([a-zA-Z0-9_]+)/);
    if (usernameMatch && usernameMatch[1]) {
        const username = usernameMatch[1];
        return `https://unavatar.io/twitter/${username}`;
    }
    return null;
}
