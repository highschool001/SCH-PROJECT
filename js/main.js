// ===== MAIN JAVASCRIPT FILE ===== 
// Multi-Channel Voter Empowerment System

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Voter Empowerment System Loaded Successfully');

    // Add active class to current navigation link
    highlightCurrentPage();

    // Check if user is on mobile
    if(window.innerWidth <= 768) {
        ShowMobilePrompt();
    }
});

// ===== Navigation Functions =====

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if(linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Show prompt for mobile users about USSD option
    function showMobilePrompt() {
        // Check if user is on the homepage
        if(window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            setTimeout(() => {
                const promptDiv = document.createElement('div');
                promptDiv.className = 'ussd-prompt';
                promptDiv.innerHTML = `
                <div class="ussd-prompt-content">
                    <i class="fas fa-mobile-alt"></i>
                    <p><strong>Tip:</strong> Dial <strong>*347#</strong> on any phone to access this service without internet!</p>
                    <button onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            promptDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: #0a2b3e;
                color: white;
                padding: 15px;
                border-radius: 10px;
                z-index: 1000;
                animation: slideUp 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(promptDiv);
            
            // Auto remove after 8 seconds
            setTimer(() => {
                if(promptDiv) promptDiv.remove();
            }, 8000);
            }, 2000);
        }
    }

    // ===== VALIDATION FUNCTIONS =====

    // Function to validate VIN (Voter Identification Number)
    function validateVIN(vin) {
        // VIN should be 10-15 digits
        const vinPattern = /^[0-9]{10,15}$/;
        return vinPattern.text(vin);
    }

    // Function to show validation error
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 12px 20px;
        border-radius: 8px;
        margin-top: 15px;
        border-left: 4px solid #dc3545;
    `;
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
    
    return errorDiv;
    }

    //Function to show success message
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 12px 20px;
        border-radius: 8px;
        margin-top: 15px;
        border-left: 4px solid #28a745;
    `;

    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
    return successDiv;
    }

    // ===== MOCK DATA FOR TESTING (Will connect to backend later) =====

const mockVoterData = {
    "1234567890": {
        name: "John Adegoke Ogunleye",
        state: "Oyo",
        lga: "Ogbomoso North",
        centerName: "LAUTECH PVC Collection Center",
        centerAddress: "LAUTECH Main Gate, Ogbomoso, Oyo State",
        latitude: 8.1574,
        longitude: 4.2587,
        queueStatus: "Moderate",
        waitTime: "45 minutes",
        pollingUnitName: "LAUTECH Gate Polling Unit",
        pollingUnitCode: "04/01/01/001"
    },
    "0987654321": {
        name: "Adebayo Oluwaseun",
        state: "Oyo",
        lga: "Ibadan North",
        centerName: "Ibadan North INEC Office",
        centerAddress: "Secretariat Road, Ibadan, Oyo State",
        latitude: 7.3775,
        longitude: 3.9470,
        queueStatus: "Low",
        waitTime: "15 minutes",
        pollingUnitName: "Bodija Market Polling Unit",
        pollingUnitCode: "02/04/03/012"
    },
    "1122334455": {
        name: "Fatima Abubakar",
        state: "Lagos",
        lga: "Ikeja",
        centerName: "Ikeja Local Government Secretariat",
        centerAddress: "Ikeja, Lagos State",
        latitude: 6.6018,
        longitude: 3.3515,
        queueStatus: "High",
        waitTime: "90 minutes",
        pollingUnitName: "Ikeja City Hall",
        pollingUnitCode: "01/02/01/005"
    }
};

// ===== PVC CENTER SEARCH FUNCTION =====
function searchPVCenter() {
    const vinInput = document.getElementById('vinInput');
    const vin = vinInput ? vinInput.value.trim() : '';
    
    // Validate VIN
    if(!vin) {
        const error = showError('Please enter your VIN');
        const container = document.querySelector('.search-card');
        if(container) container.appendChild(error);
        return;
    }
    
    if(!validateVIN(vin)) {
        const error = showError('Invalid VIN format. Please enter 10-15 digits.');
        const container = document.querySelector('.search-card');
        if(container) container.appendChild(error);
        return;
    }
    
    // Show loading
    const loading = document.getElementById('loading');
    const resultCard = document.getElementById('resultCard');
    if(loading) loading.style.display = 'block';
    if(resultCard) resultCard.style.display = 'none';
    
    // Simulate API call (replace with actual backend call)
    setTimeout(() => {
        if(loading) loading.style.display = 'none';
        
        if(mockVoterData[vin]) {
            const data = mockVoterData[vin];
            displayResult(data);
        } else {
            const error = showError('VIN not found. Please check your VIN and try again.');
            const container = document.querySelector('.search-card');
            if(container) container.appendChild(error);
        }
    }, 1000);
}

// Display search result
function displayResult(data) {
    // Populate result fields
    const fields = ['voterName', 'voterState', 'voterLGA', 'centerName', 'centerAddress', 'queueStatus', 'waitTime'];
    const mappings = {
        voterName: 'name',
        voterState: 'state',
        voterLGA: 'lga',
        centerName: 'centerName',
        centerAddress: 'centerAddress',
        queueStatus: 'queueStatus',
        waitTime: 'waitTime'
    };
    
    for(const field of fields) {
        const element = document.getElementById(field);
        if(element && mappings[field]) {
            element.innerText = data[mappings[field]];
        }
    }
    
    // Set queue status class
    const queueElement = document.getElementById('queueStatus');
    if(queueElement && data.queueStatus) {
        queueElement.className = `queue-status status-${data.queueStatus.toLowerCase()}`;
        let statusText = '';
        switch(data.queueStatus.toLowerCase()) {
            case 'low': statusText = '🟢 Low - Short wait'; break;
            case 'moderate': statusText = '🟡 Moderate - About 45 mins'; break;
            case 'high': statusText = '🔴 High - Long wait expected'; break;
            default: statusText = data.queueStatus;
        }
        queueElement.innerText = statusText;
    }
    
    // Show result card
    const resultCard = document.getElementById('resultCard');
    if(resultCard) resultCard.style.display = 'block';
    
    // Initialize map
    initMap(data.latitude, data.longitude, data.centerName);
    
    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth' });
}

// Initialize map
let map;
function initMap(lat, lng, title) {
    const mapContainer = document.getElementById('map');
    if(!mapContainer) return;
    
    // Clear previous map if exists
    if(map) {
        map.remove();
    }
    
    // Create new map
    map = L.map('map').setView([lat, lng], 15);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker
    L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>${title}</b><br>PVC Collection Center`)
        .openPopup();
}

// Get directions
function getDirections() {
    const centerLat = document.getElementById('centerLat')?.value || 8.1574;
    const centerLng = document.getElementById('centerLng')?.value || 4.2587;
    
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${centerLat},${centerLng}`;
            window.open(url, '_blank');
        }, () => {
            const url = `https://www.google.com/maps?q=${centerLat},${centerLng}`;
            window.open(url, '_blank');
        });
    } else {
        const url = `https://www.google.com/maps?q=${centerLat},${centerLng}`;
        window.open(url, '_blank');
    }
}

// Report queue status
function reportQueue() {
    const centerName = document.getElementById('centerName')?.innerText || 'Unknown Center';
    const status = prompt('Report queue status:\n1 - Low (no wait)\n2 - Moderate (30-60 mins)\n3 - High (1-2 hours)\n\nEnter 1, 2, or 3:');
    
    let statusText = '';
    switch(status) {
        case '1': statusText = 'Low'; break;
        case '2': statusText = 'Moderate'; break;
        case '3': statusText = 'High'; break;
        default: 
            alert('Invalid selection. Please try again.');
            return;
    }
    
    // Simulate saving report
    alert(`Thank you! Your report for "${centerName}" has been submitted as "${statusText}" queue status.`);
    
    // Update displayed queue status
    const queueElement = document.getElementById('queueStatus');
    if(queueElement) {
        queueElement.className = `queue-status status-${statusText.toLowerCase()}`;
        queueElement.innerText = statusText === 'Low' ? '🟢 Low - Short wait' : 
                                (statusText === 'Moderate' ? '🟡 Moderate - About 45 mins' : '🔴 High - Long wait expected');
    }
}

// ===== POLLING UNIT VERIFICATION FUNCTION =====
function verifyPollingUnit() {
    const vinInput = document.getElementById('vinInputPU');
    const vin = vinInput ? vinInput.value.trim() : '';
    
    if(!vin) {
        alert('Please enter your VIN');
        return;
    }
    
    if(!validateVIN(vin)) {
        alert('Invalid VIN format. Please enter 10-15 digits.');
        return;
    }
    
    const loading = document.getElementById('loadingPU');
    const resultCard = document.getElementById('resultCardPU');
    
    if(loading) loading.style.display = 'block';
    if(resultCard) resultCard.style.display = 'none';
    
    setTimeout(() => {
        if(loading) loading.style.display = 'none';
        
        if(mockVoterData[vin]) {
            const data = mockVoterData[vin];
            document.getElementById('voterNamePU').innerText = data.name;
            document.getElementById('pollingUnitName').innerText = data.pollingUnitName || 'Not Assigned';
            document.getElementById('pollingUnitCode').innerText = data.pollingUnitCode || 'N/A';
            document.getElementById('centerAddressPU').innerText = data.centerAddress;
            
            if(resultCard) resultCard.style.display = 'block';
            resultCard.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('VIN not found. Please check your VIN and try again.');
        }
    }, 1000);
    }
}