# GameSapper

This project is a Sapper game implemented using HTML, CSS, and JavaScript. It includes features such as different difficulty levels, Czech mode, and offline functionality using Service Workers.

## Features

- Classic Sapper gameplay
- Custom game mode with adjustable grid size and mine count
- Difficulty levels: Easy, Medium, Hard
- Czech mode with custom graphics
- Offline functionality with Service Workers
- Responsive design for various devices

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Kingurusha/GameSapper.git
    ```

2. Navigate to the project directory:
    ```bash
    cd GameSapper
    ```

3. Open `index.html` in your web browser.

## Usage

- **Start Game**: Click on the "Start Game" button.
- **Custom Game**: Click on "Start Custom Game" and adjust settings.
- **Czech Mode**: Toggle by clicking "Czech Republic Mode" button.
- **Offline Play**: The game can be played offline after the first load.

## Code Overview

### HTML

Main files:
- `index.html`
- `startGame.html`
- `startCustomGame.html`
- `documentation.html`

### CSS

Stylesheets:
- `styles.css` - General layout
- `game.css` - Game board styles
- `custom-game.css` - Custom game settings
- `documentation.css` - Documentation styles

### Service Worker

Handles offline functionality by caching necessary files.

```javascript
const CACHE_NAME = 'sapper-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/startGame.html',
    '/startCustomGame.html',
    '/documentation.html',
    '/css/styles.css',
    '/css/game.css',
    '/css/custom-game.css',
    '/song/main.mp3',
    '/picture/bomb.png',
    '/picture/flag.png',
    '/picture/skoda.png',
    '/picture/beer.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => 
            Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            )
        );
    );
});

