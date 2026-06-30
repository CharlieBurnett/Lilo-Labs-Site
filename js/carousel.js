// Auto-rotating screenshot carousel for the hero section.
// Shows three slides side by side (one on phones) and advances one slide
// to the left every 5 seconds, wrapping back to the start at the end.
(function () {
    var INTERVAL_MS = 5000;
    // Keep this breakpoint in sync with css/carousel.css.
    var MOBILE_QUERY = '(max-width: 768px)';

    document.addEventListener('DOMContentLoaded', function () {
        var track = document.querySelector('.carousel-track');
        if (!track) {
            return;
        }

        var slides = track.querySelectorAll('.carousel-slide');
        if (slides.length < 2) {
            return;
        }

        var mobile = window.matchMedia(MOBILE_QUERY);
        var current = 0;

        function visibleCount() {
            return mobile.matches ? 1 : 3;
        }

        // Last starting index that still fills every visible slot.
        function maxIndex() {
            return Math.max(0, slides.length - visibleCount());
        }

        function render() {
            var step = 100 / visibleCount();
            track.style.transform = 'translateX(-' + (current * step) + '%)';
        }

        function showNext() {
            current = current >= maxIndex() ? 0 : current + 1;
            render();
        }

        // Re-sync when the layout switches between 1-up and 3-up.
        function handleViewportChange() {
            if (current > maxIndex()) {
                current = maxIndex();
            }
            render();
        }

        if (mobile.addEventListener) {
            mobile.addEventListener('change', handleViewportChange);
        } else if (mobile.addListener) {
            mobile.addListener(handleViewportChange);
        }

        render();
        setInterval(showNext, INTERVAL_MS);
    });
})();
