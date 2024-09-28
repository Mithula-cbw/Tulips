function createTulips(containerIndex) {
    const container = document.getElementById(`container-${containerIndex}`);
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Array to hold the preloaded images
    const preloadedImages = [];
    const totalTulipImages = 5; // Adjust based on the number of tulip images you have

    // Helper function to load an image
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });
    }

    // Preload images
    const preloadPromises = [];
    for (let i = 1; i <= totalTulipImages; i++) {
        preloadPromises.push(loadImage(`${i}.png`).then((img) => {
            preloadedImages[i - 1] = img; // Store the loaded image in the array
        }));
    }

    // Wait for all images to preload before creating tulips
    Promise.all(preloadPromises).then(() => {
        // Generate and append tulips
        for (let i = 0; i < 100; i++) {
            const tulipClassID = Math.floor(Math.random() * 7) + 1;
            const tulipImgID = Math.floor(Math.random() * totalTulipImages);

            // Create the tulip container
            const tulip = document.createElement('div');
            tulip.classList.add(`tulip-${tulipClassID}`);
            preloadedImages[tulipImgID].alt = `tulip-${i + 1}`;
            preloadedImages[tulipImgID].classList.add('tulip-img');

            // Append the preloaded image to the tulip div
            tulip.appendChild(preloadedImages[tulipImgID].cloneNode()); // Clone to avoid issues

            // Randomly position the tulip inside the container
            const randomX = Math.random() * (containerWidth + 50); // 50 is the tulip width
            const randomY = Math.random() * (containerHeight + 50);

            tulip.style.left = `${randomX}px`;
            tulip.style.top = `${randomY}px`;

            // Append the tulip to the container
            container.appendChild(tulip);
        }
    }).catch((error) => {
        console.error(error);
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        createTulips(1);
        createTulips(2);
        createTulips(3);
        createTulips(4);
        createTulips(5);
    }, 0); // 2 second delay
});


document.addEventListener('DOMContentLoaded', () => {
    // Unix timestamp (in seconds) to count down to
    var toDayFromNow = (new Date("Dec 31, 2024 23:59:59").getTime() / 1000);
    var toDayFrom = (new Date("jun 20, 2023 13:06:00").getTime() / 1000) + (3600 / 60 / 60 / 24) - 1;
    
    console.log(toDayFrom);
    // console.log(toDayFromNow);

    // Set Up FlipDown
    var flipdown = new FlipDown(toDayFrom)
    
    // Start The Count Down
    .start()
    // Do Something When The Countdown Ends
    .ifEnded(() => {
        document.querySelector(".flipdown").innerHTML = `<h2>Timer is ended</h2>`;
    });
});

