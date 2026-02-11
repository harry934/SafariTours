document.addEventListener('DOMContentLoaded', () => {
    initExpandableCards();
    initFilters();
});

/* --- Expandable Tour Cards --- */
function initExpandableCards() {
    const expandButtons = document.querySelectorAll('.expand-btn');

    expandButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent bubbling if necessary
            
            const card = this.closest('.tour-card');
            const content = card.querySelector('.expandable-content');
            
            // Toggle active class on button (optional for styling)
            this.classList.toggle('active');
            
            // Toggle text
            if (this.classList.contains('active')) {
                this.textContent = 'Hide Itinerary';
                this.classList.add('bg-primary', 'text-white');
                this.classList.remove('text-primary');
                
                // Expand
                content.classList.add('expanded');
            } else {
                this.textContent = 'View Itinerary';
                this.classList.remove('bg-primary', 'text-white');
                this.classList.add('text-primary');
                
                // Collapse
                content.classList.remove('expanded');
            }
        });
    });
}

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
    priceRange.addEventListener('input', () => {
        priceValue.textContent = `$${priceRange.value}`;
        filterTours();
    });

    // Listeners for all inputs
    searchInput.addEventListener('input', filterTours);
    destinationSelect.addEventListener('change', filterTours);
    durationCheckboxes.forEach(cb => cb.addEventListener('change', filterTours));
    
    // Reset Filters
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        destinationSelect.value = 'all';
        priceRange.value = 5000;
        priceValue.textContent = '$5000';
        durationCheckboxes.forEach(cb => cb.checked = false);
        filterTours();
    });

    function filterTours() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedDestination = destinationSelect.value;
        const maxPrice = parseInt(priceRange.value);
        
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
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
}
