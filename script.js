const imageUpload = document.getElementById('imageUpload');
const uploadedImage = document.getElementById('uploadedImage');
const imageCanvas = document.getElementById('imageCanvas');
const distanceDisplay = document.getElementById('distanceDisplay');
const resetButton = document.getElementById('resetButton');
const ctx = imageCanvas.getContext('2d');

let pointA = null;
let pointB = null;
let imageDataURL = null;

function drawImageOnCanvas() {
    imageCanvas.width = uploadedImage.width;
    imageCanvas.height = uploadedImage.height;
    ctx.drawImage(uploadedImage, 0, 0, uploadedImage.width, uploadedImage.height);
}

function drawPoint(x, y, color = 'red') {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(x1, y1, x2, y2, color = 'blue') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function resetPoints() {
    pointA = null;
    pointB = null;
    distanceDisplay.textContent = '';
    if (imageDataURL) {
        const img = new Image();
        img.onload = () => {
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = imageDataURL;
    } else {
        ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    }
}

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.src = e.target.result;
            uploadedImage.style.display = 'block';
            uploadedImage.onload = drawImageOnCanvas;
            imageCanvas.style.display = 'block';
            imageDataURL = e.target.result;
            resetPoints();
        };
        reader.readAsDataURL(file);
    } else {
        uploadedImage.style.display = 'none';
        imageCanvas.style.display = 'none';
        imageDataURL = null;
        resetPoints();
    }
});

imageCanvas.addEventListener('click', (event) => {
    const rect = imageCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!pointA) {
        pointA = { x, y };
        drawPoint(x, y);
    } else if (!pointB) {
        pointB = { x, y };
        drawPoint(x, y);
        drawLine(pointA.x, pointA.y, pointB.x, pointB.y);

        // Basic Frontend Calculation 
        // const deltaX = pointB.x - pointA.x;
        // const deltaY = pointB.y - pointA.y;
        // const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        // distanceDisplay.textContent = `Distance (pixels): ${distance.toFixed(2)}`;

        //  Send to Python Backend
      
        fetch('/calculate_distance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pointA, pointB }),
        })
        .then(response => response.json())
        .then(data => {
            distanceDisplay.textContent = `Distance (pixels): ${data.distance.toFixed(2)}`;
        })
        .catch(error => {
            console.error('Error sending data to backend:', error);
            distanceDisplay.textContent = 'Error calculating distance.';
        });
    }
});

resetButton.addEventListener('click', resetPoints);
