// Dom element declarations
const audioInput = document.getElementById('audioFile');
const dropZone = document.getElementById('dropZone');
const fileBadge = document.getElementById('fileBadge');
const submitBtn = document.getElementById('submitBtn');
const processingState = document.getElementById('processingState');
const statusText = document.getElementById('statusText');
const resultsWrapper = document.getElementById('resultsWrapper');

const outputSummary = document.getElementById('outputSummary');
const outputActions = document.getElementById('outputActions');
const outputKeys = document.getElementById('outputKeys');

console.log(submitBtn,"btn")
dropZone.addEventListener('click', () => {
    audioInput.click();
});

audioInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

['dragover', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => e.preventDefault());
});

dropZone.addEventListener('dragover', () => dropZone.classList.add('dragover'));
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        audioInput.files = e.dataTransfer.files;
        handleFile(e.dataTransfer.files[0]);
    }
});

function handleFile(file) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    fileBadge.textContent = `✓ ${file.name} (${sizeInMB} MB)`;
    fileBadge.style.display = 'block';
    submitBtn.disabled = false;
    
    resultsWrapper.classList.remove('active');
}

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();  
    e.stopPropagation(); 
    const file = audioInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('audio', file);

    submitBtn.disabled = true;
    processingState.style.display = 'block';
    resultsWrapper.classList.remove('active');
    statusText.textContent = "Uploading audio file to processing core...";
        
    let statusTimeout = setTimeout(() => {
        statusText.textContent = "AI is scanning transcript & extracting insights...";
    }, 3500);

    try {
        const response = await fetch("/upload", {
            method: 'POST',
            body: formData
        });


        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to extract meeting insights.');
        }
        


        const data = await response.json();
        
        clearTimeout(statusTimeout);
        processingState.style.display = 'none';

        renderDashboard(data);

     } 
     catch (error) {
        console.log("CATCH ERROR:", error.message, error);
        clearTimeout(statusTimeout);
        processingState.style.display = 'none';
        submitBtn.disabled = false;
    }
});
console.log(resultsWrapper,"renderdashboard1");
function renderDashboard(data) {

    console.log(resultsWrapper,"renderdashboard2");
    console.log("Rendering Dashboard UI with received data:", data);

    outputSummary.textContent = data.summary || "No executive summary available.";

    outputActions.innerHTML = data.actionItems && data.actionItems.length 
        ? data.actionItems.map(item => `<li>${item}</li>`).join('')
        : '<li>No explicit action items assigned.</li>';

    outputKeys.innerHTML = data.keyPoints && data.keyPoints.length 
        ? data.keyPoints.map(point => `<li>${point}</li>`).join('')
        : '<li>No strategic key insights extracted.</li>';
        console.log("Dashboard rendered successfully");


    resultsWrapper.classList.add('active');
    submitBtn.disabled = false;
}