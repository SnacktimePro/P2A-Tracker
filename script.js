document.addEventListener('DOMContentLoaded', async () => {
    const calendarEl = document.getElementById('calendar');
    const filterEl = document.getElementById('filter');
    const searchEl = document.getElementById('search'); // New search bar element

    // Fetch game data
    const response = await fetch('data.json');
    const games = await response.json();

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: games.map((game) => ({
            ...game,
            className: `status-${game.status}`,
            extendedProps: {
                description: `Status: ${game.status.toUpperCase()}`,
            },
        })),
        plugins: [FullCalendar.Tooltip],
        eventDidMount: function (info) {
            new Tooltip(info.el, {
                title: info.event.extendedProps.description,
                placement: 'top',
                trigger: 'hover',
                container: 'body',
            });
        },
        eventClick: function (info) {
            info.jsEvent.preventDefault();
            if (info.event.url) {
                window.open(info.event.url, '_blank');
            }
        },
    });

    calendar.render();

    // Filter functionality
    filterEl.addEventListener('change', () => {
        const filterValue = filterEl.value;

        const filteredEvents = games.filter((game) => (filterValue === 'all' ? true : game.status === filterValue));

        calendar.removeAllEvents();
        calendar.addEventSource(
            filteredEvents.map((game) => ({
                ...game,
                className: `status-${game.status}`,
                extendedProps: {
                    description: `Status: ${game.status.toUpperCase()}`,
                },
            }))
        );
    });

    // Search functionality
    searchEl.addEventListener('input', () => {
        const query = searchEl.value.toLowerCase();

        const filteredEvents = games.filter((game) => game.title.toLowerCase().includes(query));

        calendar.removeAllEvents();
        calendar.addEventSource(
            filteredEvents.map((game) => ({
                ...game,
                className: `status-${game.status}`,
                extendedProps: {
                    description: `Status: ${game.status.toUpperCase()}`,
                },
            }))
        );
    });
});
