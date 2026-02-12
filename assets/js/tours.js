document.addEventListener('DOMContentLoaded', () => {
    initFilters();
});

/* --- Filter Logic --- */
function initFilters() {
    const searchInput = document.getElementById('search-input');
    const destinationSelect = document.getElementById('destination-filter');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const durationCheckboxes = document.querySelectorAll('input[name="duration"]');
    const resetButton = document.getElementById('reset-filters');
    const tourCards = document.querySelectorAll('.tour-card');
    const noResults = document.getElementById('no-results');

    // Update Price Label
    if (priceRange) {
        priceRange.addEventListener('input', () => {
            priceValue.textContent = `$${priceRange.value}`;
            filterTours();
        });
    }

    // Listeners for all inputs
    searchInput?.addEventListener('input', filterTours);
    destinationSelect?.addEventListener('change', filterTours);
    durationCheckboxes.forEach(cb => cb.addEventListener('change', filterTours));
    
    // Reset Filters
    resetButton?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (destinationSelect) destinationSelect.value = 'all';
        if (priceRange) {
            priceRange.value = 5000;
            priceValue.textContent = '$5000';
        }
        durationCheckboxes.forEach(cb => cb.checked = false);
        filterTours();
    });

    function filterTours() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedDestination = destinationSelect ? destinationSelect.value : 'all';
        const maxPrice = priceRange ? parseInt(priceRange.value) : 10000;
        
        // Get selected durations
        const selectedDurations = Array.from(durationCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        let visibleCount = 0;

        tourCards.forEach(card => {
            const cardDestination = card.getAttribute('data-destination');
            const cardPrice = parseInt(card.getAttribute('data-price'));
            const cardDuration = parseInt(card.getAttribute('data-duration'));
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();

            // 1. Search Filter
            const matchesSearch = cardTitle.includes(searchTerm);

            // 2. Destination Filter
            const matchesDestination = selectedDestination === 'all' || cardDestination === selectedDestination;

            // 3. Price Filter
            const matchesPrice = cardPrice <= maxPrice;

            // 4. Duration Filter
            let matchesDuration = true;
            if (selectedDurations.length > 0) {
                matchesDuration = false;
                selectedDurations.forEach(type => {
                    if (type === 'short' && cardDuration <= 3) matchesDuration = true;
                    if (type === 'medium' && cardDuration >= 4 && cardDuration <= 6) matchesDuration = true;
                    if (type === 'long' && cardDuration >= 7) matchesDuration = true;
                });
            }

            // Final check
            if (matchesSearch && matchesDestination && matchesPrice && matchesDuration) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/Hide "No Results" message
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }
    }
}
