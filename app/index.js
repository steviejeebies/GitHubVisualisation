drawHistogram({a:"b"})

drawPieChart({a:"b"})

function preventDefault(event) { 
    event.preventDefault(); 
    drawBarChart({a:"b"})
} 
document.getElementById("getthingy").addEventListener('submit', preventDefault);



