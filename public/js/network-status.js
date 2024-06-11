function updateOnlineStatus() {
    const statusElement = document.getElementById('networkStatus');
    if (navigator.onLine) {
        // Update status to Online
        statusElement.textContent = 'Online';
        statusElement.style.color = 'green';
    } else {
        // Update status to Offline
        statusElement.textContent = 'Offline';
        statusElement.style.color = 'red';
    }
}

window.addEventListener('load', () => {
    // Create and append the network status element
    const statusElement = document.createElement('div');
    statusElement.id = 'networkStatus';
    document.body.appendChild(statusElement);
    updateOnlineStatus();

    // Add event listeners for online and offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});
