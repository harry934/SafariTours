document.addEventListener('DOMContentLoaded', () => {
    initBookingForm();
});

function initBookingForm() {
    const tourSelect = document.getElementById('tour-select');
    const datePicker = document.getElementById('date-picker');
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
    
    // Summary Elements
    const summaryTour = document.getElementById('summary-tour');
    const summaryDate = document.getElementById('summary-date');
    const summaryAdults = document.getElementById('summary-adults');
    const summaryChildren = document.getElementById('summary-children');
    const totalPriceEl = document.getElementById('total-price');

    // Initialize Flatpickr
    flatpickr(datePicker, {
        minDate: "today",
        dateFormat: "F j, Y",
        onChange: function(selectedDates, dateStr) {
            summaryDate.textContent = dateStr;
        }
    });

    // Update Price Calculation
    function updatePrice() {
        const selectedOption = tourSelect.options[tourSelect.selectedIndex];
        const basePrice = parseInt(selectedOption.dataset.price) || 0;
        const adults = parseInt(adultsInput.value) || 0;
        const children = parseInt(childrenInput.value) || 0;

        // Simple Logic: Children are 50% price
        const total = (basePrice * adults) + (basePrice * 0.5 * children);
        
        totalPriceEl.textContent = '$' + total.toLocaleString();

        // Update Summary Text
        if (selectedOption.value) {
            summaryTour.textContent = selectedOption.text.split(' - ')[0]; // Remove price from text
        }
        summaryAdults.textContent = adults;
        summaryChildren.textContent = children;
    }

    // Listeners
    tourSelect.addEventListener('change', updatePrice);
    
    // Expose toggle function for the +/- buttons (defined in GLOBAL scope for inline onclicks)
    window.adjustCount = function(id, delta) {
        const input = document.getElementById(id);
        let val = parseInt(input.value) || 0;
        val += delta;
        
        // Constraints
        if (id === 'adults' && val < 1) val = 1;
        if (id === 'children' && val < 0) val = 0;
        if (val > 10) val = 10;

        input.value = val;
        updatePrice();
    };

    // Initialize logic if values pre-filled (browser cache)
    updatePrice();

    // Check URL params for pre-selection
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedTour = urlParams.get('tour');
    if (preSelectedTour) {
        tourSelect.value = preSelectedTour;
        updatePrice();
    }
}
