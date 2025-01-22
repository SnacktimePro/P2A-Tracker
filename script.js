document.addEventListener('DOMContentLoaded', async () => {
    const calendarEl = document.getElementById('calendar');
    const filterEl = document.getElementById('filter');
    const searchEl = document.getElementById('search'); // New search bar element

    // Fetch game data
    const response = await fetch('data.json');
    const games = await response.json();
    const today = new Date(); // Get today's date in YYYY-MM-DD format
    // Add one day to the endDate
    today.setDate(today.getDate() + 1);

    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'dark',
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        height: 'auto', // Let the calendar height adjust automatically
        contentHeight: 'auto', // Make sure day cells expand for content
        events: games.map((game, index) => {
            // Ensure each game has a unique 'id' field
            const gameId = game.id || `game-${index + 1}`; // Use index as fallback
            // If no end date is provided, use today's date for a fallback (in 'YYYY-MM-DD' format)
            const endDate = getEndDate(game);

            return {
                id: gameId, // Ensure each event has an ID
                title: game.title,
                start: game.start,
                end: endDate,
                url: game.url,
                allDay: true,
                classNames: ['status-' + game.status],
                extendedProps: {
                    status: game.status,
                    endDate: endDate,
                },
            };
        }),
        eventClick: function (info) {
            if (info.event.url) {
                window.open(info.event.url, '_blank'); // Open the link in a new tab
                info.jsEvent.preventDefault(); // Prevent the default navigation
            }
        },
        eventDidMount: function (info) {
            const status = info.event.extendedProps.status;
            const endDate = info.event.extendedProps.endDate;

            if (status === 'ongoing' && endDate >= today) {
                // Add a class to the event container indicating ongoing status
                info.el.classList.add('ongoing-event');
            }
        },

        eventOverlap: function (stillEvent, movingEvent) {
            return false;
        },
        moreLinkClick: 'popover',
    });
    // Force reflow after initial render
    setTimeout(() => calendar.render(), 100); // Small delay to trigger layout recalculation
    calendar.on('datesSet', function () {
        setTimeout(() => {
            calendar.render(); // Force re-render of the calendar
        }, 0); // Slight delay to allow FullCalendar to adjust its layout
    });
    // Filter functionality
    filterEl.addEventListener('change', () => {
        const filterValue = filterEl.value;

        const filteredEvents = games.filter((game) => (filterValue === 'all' ? true : game.status === filterValue));

        calendar.removeAllEvents();
        calendar.addEventSource(
            filteredEvents.map((game, index) => {
                // Ensure each game has a unique 'id' field
                const gameId = game.id || `game-${index + 1}`; // Use index as fallback
                // If no end date is provided, use today's date for a fallback (in 'YYYY-MM-DD' format)
                const endDate = getEndDate(game);
                const eventData = {
                    id: gameId,
                    title: game.title,
                    start: game.start,
                    end: endDate,
                    url: game.url,
                    allDay: true,
                    classNames: ['status-' + game.status],
                    extendedProps: {
                        status: game.status,
                    },
                };

                // Add the 'ongoing-event' class if the event is ongoing
                if (game.status === 'ongoing' && endDate >= today) {
                    eventData.classNames.push('ongoing-event'); // Add the class here
                    //Sometimes, FullCalendar's internal layout and rendering processes don't immediately adjust to the changes made to the event data.
                    setTimeout(() => calendar.render(), 100); // Small delay to trigger layout recalculation
                }

                return eventData;
            })
        );
    });

    // Search functionality
    searchEl.addEventListener('input', () => {
        const query = searchEl.value.toLowerCase();

        const filteredEvents = games.filter((game) => game.title.toLowerCase().includes(query));

        calendar.removeAllEvents();
        calendar.addEventSource(
            filteredEvents.map((game, index) => {
                // Ensure each game has a unique 'id' field
                const gameId = game.id || `game-${index + 1}`; // Use index as fallback
                // If no end date is provided, use today's date for a fallback (in 'YYYY-MM-DD' format)
                const endDate = getEndDate(game);
                const eventData = {
                    id: gameId,
                    title: game.title,
                    start: game.start,
                    end: endDate,
                    url: game.url,
                    allDay: true,
                    classNames: ['status-' + game.status],
                    extendedProps: {
                        status: game.status,
                    },
                };

                // Add the 'ongoing-event' class if the event is ongoing
                if (game.status === 'ongoing' && endDate >= today) {
                    eventData.classNames.push('ongoing-event'); // Add the class here
                    //Sometimes, FullCalendar's internal layout and rendering processes don't immediately adjust to the changes made to the event data.
                    setTimeout(() => calendar.render(), 100); // Small delay to trigger layout recalculation
                }

                return eventData;
            })
        );
    });
});

// Function to get the end date based on game status and end date
function getEndDate(game) {
    const today = new Date(); // Get today's date
    today.setDate(today.getDate() + 1);
    let endDate;

    if (game.status === 'ongoing') {
        // If the game is ongoing and has an end date, add 1 day to it
        if (game.end) {
            const gameEndDate = new Date(game.end);
            gameEndDate.setDate(gameEndDate.getDate() + 1); // Add one day to the end date
            endDate = gameEndDate > today ? today : gameEndDate; // If the adjusted end date is in the future, use today's date
        } else {
            endDate = today; // If no end date, set it to today
        }
    } else {
        endDate = game.end || today; // Default to today's date if no end date is provided
    }

    return endDate;
}
