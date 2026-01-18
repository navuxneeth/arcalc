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
const lengthFtInchDisplay = document.getElementById('length-ftinch');
const widthFtInchDisplay = document.getElementById('width-ftinch');

// Mode 2: FT/IN to CM Calculator
const lengthFt = document.getElementById('length-ft');
const lengthIn = document.getElementById('length-in');
const widthFt = document.getElementById('width-ft');
const widthIn = document.getElementById('width-in');
const lengthCmDisplay2 = document.getElementById('length-cm-2');
const widthCmDisplay2 = document.getElementById('width-cm-2');
const output2Sqft = document.getElementById('output2-sqft');
const output2Sqm = document.getElementById('output2-sqm');
const output2Cent = document.getElementById('output2-cent');

// Mode 3: All-in-one calculator
const lengthCm3 = document.getElementById('length-cm-3');
const widthCm3 = document.getElementById('width-cm-3');
const lengthFt3 = document.getElementById('length-ft-3');
const lengthIn3 = document.getElementById('length-in-3');
const widthFt3 = document.getElementById('width-ft-3');
const widthIn3 = document.getElementById('width-in-3');
const lengthSummary3 = document.getElementById('length-summary-3');
const widthSummary3 = document.getElementById('width-summary-3');
const output3Sqft = document.getElementById('output3-sqft');
const output3Sqm = document.getElementById('output3-sqm');
const output3Cent = document.getElementById('output3-cent');

// Conversion constants
const CM2_TO_SQ_FT = 0.00107639; // 1 cm² = 0.00107639 sq ft
const CM2_TO_SQ_M = 0.0001; // 1 cm² = 0.0001 sq m
const SQ_FT_PER_CENT = 435.6; // 1 cent = 435.6 sq ft
const CM_PER_INCH = 2.54;
const CM_PER_FOOT = CM_PER_INCH * 12;
const INCH_DISPLAY_DECIMALS = 3;
const INPUT_ROUND_FACTOR = 1000;

function sanitizeNumber(value) {
    const num = parseFloat(value);
    return Number.isFinite(num) ? num : 0;
}

function feetInchesToCm(feet, inches) {
    return sanitizeNumber(feet) * CM_PER_FOOT + sanitizeNumber(inches) * CM_PER_INCH;
}

function cmToFeetInches(cm) {
    const totalInches = sanitizeNumber(cm) / CM_PER_INCH;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches - feet * 12;
    return { feet, inches };
}

function formatInches(inches) {
    return inches.toFixed(INCH_DISPLAY_DECIMALS).replace(/\.?0+$/, '');
}

function formatFeetInches(cm) {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet} ft ${formatInches(inches)} in`;
}

function setInputValue(input, value) {
    if (!input) return;
    const num = sanitizeNumber(value);
    input.value = num === 0 ? '0' : (Math.round(num * INPUT_ROUND_FACTOR) / INPUT_ROUND_FACTOR).toString();
}

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

    if (lengthFtInchDisplay && widthFtInchDisplay) {
        lengthFtInchDisplay.textContent = formatFeetInches(length);
        widthFtInchDisplay.textContent = formatFeetInches(width);
    }
}

function formatNumber(num) {
    // Format numbers based on magnitude for optimal readability
    if (num === 0) return '0';
    if (num < 0.01) return num.toExponential(4); // Very small numbers: scientific notation
    if (num < 1) return num.toFixed(6).replace(/\.?0+$/, ''); // Small decimals: up to 6 places
    if (num < 100) return num.toFixed(4).replace(/\.?0+$/, ''); // Medium numbers: up to 4 places
    return num.toFixed(2).replace(/\.?0+$/, ''); // Large numbers: up to 2 places
}

// Real-time calculation on input
lengthCm.addEventListener('input', calculateMode1);
widthCm.addEventListener('input', calculateMode1);

function calculateMode2() {
    const lengthCmVal = feetInchesToCm(lengthFt?.value, lengthIn?.value);
    const widthCmVal = feetInchesToCm(widthFt?.value, widthIn?.value);

    if (lengthCmDisplay2) lengthCmDisplay2.textContent = formatNumber(lengthCmVal);
    if (widthCmDisplay2) widthCmDisplay2.textContent = formatNumber(widthCmVal);

    const areaCm2 = lengthCmVal * widthCmVal;
    const sqFt = areaCm2 * CM2_TO_SQ_FT;
    const sqM = areaCm2 * CM2_TO_SQ_M;
    const cent = sqFt / SQ_FT_PER_CENT;

    if (output2Sqft) output2Sqft.textContent = formatNumber(sqFt);
    if (output2Sqm) output2Sqm.textContent = formatNumber(sqM);
    if (output2Cent) output2Cent.textContent = formatNumber(cent);
}

[lengthFt, lengthIn, widthFt, widthIn].forEach(input => {
    if (input) {
        input.addEventListener('input', calculateMode2);
    }
});

let mode3Updating = false;
function calculateMode3(from = 'cm') {
    if (mode3Updating) return;
    mode3Updating = true;

    let lengthCmVal;
    let widthCmVal;

    if (from === 'cm') {
        lengthCmVal = sanitizeNumber(lengthCm3?.value);
        widthCmVal = sanitizeNumber(widthCm3?.value);

        const { feet: lf, inches: li } = cmToFeetInches(lengthCmVal);
        const { feet: wf, inches: wi } = cmToFeetInches(widthCmVal);
        setInputValue(lengthFt3, lf);
        setInputValue(lengthIn3, li);
        setInputValue(widthFt3, wf);
        setInputValue(widthIn3, wi);
    } else {
        const lf = sanitizeNumber(lengthFt3?.value);
        const li = sanitizeNumber(lengthIn3?.value);
        const wf = sanitizeNumber(widthFt3?.value);
        const wi = sanitizeNumber(widthIn3?.value);

        lengthCmVal = feetInchesToCm(lf, li);
        widthCmVal = feetInchesToCm(wf, wi);
        setInputValue(lengthCm3, lengthCmVal);
        setInputValue(widthCm3, widthCmVal);
    }

    const areaCm2 = lengthCmVal * widthCmVal;
    const sqFt = areaCm2 * CM2_TO_SQ_FT;
    const sqM = areaCm2 * CM2_TO_SQ_M;
    const cent = sqFt / SQ_FT_PER_CENT;

    if (output3Sqft) output3Sqft.textContent = formatNumber(sqFt);
    if (output3Sqm) output3Sqm.textContent = formatNumber(sqM);
    if (output3Cent) output3Cent.textContent = formatNumber(cent);

    if (lengthSummary3) lengthSummary3.textContent = `${formatNumber(lengthCmVal)} cm | ${formatFeetInches(lengthCmVal)}`;
    if (widthSummary3) widthSummary3.textContent = `${formatNumber(widthCmVal)} cm | ${formatFeetInches(widthCmVal)}`;

    mode3Updating = false;
}

[lengthCm3, widthCm3].forEach(input => {
    if (input) {
        input.addEventListener('input', () => calculateMode3('cm'));
    }
});

[lengthFt3, lengthIn3, widthFt3, widthIn3].forEach(input => {
    if (input) {
        input.addEventListener('input', () => calculateMode3('ft'));
    }
});

// Initialize with zeros
calculateMode1();
calculateMode2();
calculateMode3();
