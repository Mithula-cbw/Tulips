function createTulips(containerIndex) {
    const container = document.getElementById(`container-${containerIndex}`);
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    for (let i = 0; i < 80; i++) {

        const tulipClassID = Math.floor((Math.random()*7) + 1);
        // Create the tulip container
        const tulip = document.createElement('div');
        tulip.classList.add(`tulip-${tulipClassID}`);

        
        const tulipImgID = Math.floor(Math.random() *5) + 1;
       
        // Create the image element inside the tulip
        const tulipImg = document.createElement('img');
        tulipImg.src = `${tulipImgID}.png`; // Change to any tulip image you have
        tulipImg.alt = `tulip-${i + 1}`;
        tulipImg.classList.add('tulip-img');

         // Append the image to the tulip div
         tulip.appendChild(tulipImg);

        // Randomly position the tulip inside the container
        const randomX = Math.random() * (containerWidth + 50); // 50 is the tulip width
        const randomY = Math.random() * (containerHeight + 50);

        tulip.style.left = `${randomX}px`;
        tulip.style.top = `${randomY}px`;

        // Append the tulip to the container
        container.appendChild(tulip);
    }
}

    // Call the function to create tulips
     

    document.addEventListener('DOMContentLoaded',()=>{
    createTulips(1);
    createTulips(2);
    createTulips(3);
    createTulips(4);
    createTulips(5);   
    });