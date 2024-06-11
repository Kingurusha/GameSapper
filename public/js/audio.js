document.addEventListener('DOMContentLoaded', () => {
    const gameMusic = document.getElementById('gameMusic');
    gameMusic.volume = 0.5; // Set volume to 50%

    // Attempt to autoplay
    gameMusic.play().catch(() => {
        // If autoplay is blocked, wait for user interaction
        const interactionHandler = () => {
            gameMusic.play();
            document.removeEventListener('click', interactionHandler);
        };
        document.addEventListener('click', interactionHandler);
    });
});
