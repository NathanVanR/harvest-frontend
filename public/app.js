
let listings = [
    { id: 1, name: "Hass Avocados", category: "Tree", price: "$5/pkg", desc: "Our tree went crazy. Got about 15 extra avocados sitting in crates.", distance: "2 blocks away" },
    { id: 2, name: "Fresh Rosemary", category: "Herbs", price: "Trade", desc: "Massive rosemary bush needs pruning. Happy to trade for tomatoes.", distance: "0.5 miles away" }
];

// Screen Router Initialization
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Toggle Active Button
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Switch Active Screen
        const targetScreen = btn.getAttribute('data-target');
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(targetScreen).classList.add('active');
    });
});

// Render UI on load
renderAll();

// Handle Post Submissions
document.getElementById('harvestForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newListing = {
        id: Date.now(), // Easy unique ID timestamp
        name: document.getElementById('produceName').value,
        category: document.getElementById('produceCategory').value,
        price: document.getElementById('producePrice').value,
        desc: document.getElementById('produceDesc').value,
        distance: "Your Yard"
    };

    listings.unshift(newListing); // Add new items to front of array
    this.reset();
    renderAll();
});

// Remove Listing Logic
function deleteListing(id) {
    listings = listings.filter(item => item.id !== id);
    renderAll();
}

// Master Render Function
function renderAll() {
    const marketBoard = document.getElementById('marketBoard');
    const myListingsContainer = document.getElementById('myListingsContainer');
    
    // Clear targets
    marketBoard.innerHTML = '';
    myListingsContainer.innerHTML = '';

    if (listings.length === 0) {
        myListingsContainer.innerHTML = '<p class="empty-text">You haven\'t posted any items yet.</p>';
    }

    listings.forEach(item => {
        // Build card for Public Market View
        const marketCard = document.createElement('div');
        marketCard.className = 'pixel-box item-card';
        marketCard.innerHTML = `
            <div class="item-header">
                <span>${escapeHTML(item.name)}</span>
                <span class="item-price">${escapeHTML(item.price)}</span>
            </div>
            <div class="item-meta">
                <span class="badge">${escapeHTML(item.category)}</span> • ${escapeHTML(item.distance)}
            </div>
            <div class="item-desc">${escapeHTML(item.desc)}</div>
            <button class="pixel-btn btn-claim">Claim Offer</button>
        `;
        marketBoard.appendChild(marketCard);

        // Build simple strip for Manage View if it belongs to user
        if (item.distance === "Your Yard") {
            const manageStrip = document.createElement('div');
            manageStrip.className = 'pixel-box';
            manageStrip.style.backgroundColor = '#1b1f32';
            manageStrip.innerHTML = `
                <div class="item-header" style="font-size: 0.65rem;">
                    <span>${escapeHTML(item.name)}</span>
                    <span class="item-price">${escapeHTML(item.price)}</span>
                </div>
                <button class="pixel-btn btn-delete" style="font-size:0.55rem; padding:6px; margin-top:10px;" onclick="deleteListing(${item.id})">Remove</button>
            `;
            myListingsContainer.appendChild(manageStrip);
        }
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}