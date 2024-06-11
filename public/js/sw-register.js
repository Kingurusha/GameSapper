// Check if service workers are supported
if ('serviceWorker' in navigator) {
    // Add event listener for window load
    window.addEventListener('load', () => {
        // Register the service worker
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                // Successful registration
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                // Failed registration
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
