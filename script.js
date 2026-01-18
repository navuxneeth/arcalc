// Mode switching
const modeButtons = document.querySelectorAll('.mode-btn');
const modePanels = document.querySelectorAll('.mode-panel');

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        
        // Update active button
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update active panel
        modePanels.forEach(panel => panel.classList.remove('active'));
        document.getElementById(`mode-${mode}`).classList.add('active');
    });
});

// Mode 1: CM to SQ FT Calculator
const lengthCm = document.getElementById('length-cm');
const widthCm = document.getElementById('width-cm');
const outputSqft = document.getElementById('output-sqft');
const outputSqm = document.getElementById('output-sqm');
const outputCent = document.getElementById('output-cent');

// Conversion constants
const CM2_TO_SQ_FT = 0.00107639; // 1 cm² = 0.00107639 sq ft
const CM2_TO_SQ_M = 0.0001; // 1 cm² = 0.0001 sq m
const SQ_FT_PER_CENT = 435.6; // 1 cent = 435.6 sq ft

function calculateMode1() {
    const length = parseFloat(lengthCm.value) || 0;
    const width = parseFloat(widthCm.value) || 0;
    
    // Calculate area in square centimeters
    const areaCm2 = length * width;
    
    // Convert to different units
    const sqFt = areaCm2 * CM2_TO_SQ_FT;
    const sqM = areaCm2 * CM2_TO_SQ_M;
    const cent = sqFt / SQ_FT_PER_CENT;
    
    // Update output with formatted values
    outputSqft.textContent = formatNumber(sqFt);
    outputSqm.textContent = formatNumber(sqM);
    outputCent.textContent = formatNumber(cent);
}

function formatNumber(num) {
    if (num === 0) return '0';
    if (num < 0.01) return num.toExponential(4);
    if (num < 1) return num.toFixed(6).replace(/\.?0+$/, '');
    if (num < 100) return num.toFixed(4).replace(/\.?0+$/, '');
    return num.toFixed(2).replace(/\.?0+$/, '');
}

// Real-time calculation on input
lengthCm.addEventListener('input', calculateMode1);
widthCm.addEventListener('input', calculateMode1);

// Initialize with zeros
calculateMode1();
