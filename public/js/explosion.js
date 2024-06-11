document.addEventListener('DOMContentLoaded', () => {
    const bombBody = document.getElementById('bombBody');
    const bombFuse = document.getElementById('bombFuse');
    const spark1 = document.getElementById('spark1');
    const spark2 = document.getElementById('spark2');
    const spark3 = document.getElementById('spark3');
    const clickMeContainer = document.getElementById('clickMeContainer');
    const clickMeText = document.getElementById('clickMeText');
    const arrowSvg = document.getElementById('arrowSvg');

    bombBody.addEventListener('click', () => {
        // Start the spark animation
        spark1.style.animation = 'spark 0.5s infinite';
        spark2.style.animation = 'spark 0.5s infinite';
        spark3.style.animation = 'spark 0.5s infinite';

        // Stop the spark animation and start the explosion after 2 seconds
        setTimeout(() => {
            spark1.style.animation = '';
            spark2.style.animation = '';
            spark3.style.animation = '';

            // Apply explosion animation to all elements
            bombBody.style.animation = 'explode 1s forwards';
            bombFuse.style.animation = 'explode 1s forwards';
            spark1.style.animation = 'explode 1s forwards';
            spark2.style.animation = 'explode 1s forwards';
            spark3.style.animation = 'explode 1s forwards';
            clickMeText.style.animation = 'explode 1s forwards';
            arrowSvg.style.animation = 'explode 1s forwards';
        }, 2000);
    });
});
