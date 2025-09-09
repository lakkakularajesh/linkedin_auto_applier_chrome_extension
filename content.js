// Extract job cards from LinkedIn Jobs page
function getJobCards() {
    return Array.from(document.querySelectorAll('li[data-occludable-job-id]'));
}

// Extract job details from a job card element
function extractJobDetails(jobCard) {
    const jobId = jobCard.getAttribute('data-occludable-job-id');
    const titleElem = jobCard.querySelector('a');
    const title = titleElem ? titleElem.innerText.split('\n')[0] : '';
    const otherDetailsElem = jobCard.querySelector('.artdeco-entity-lockup__subtitle');
    let company = '', workLocation = '', workStyle = '';
    if (otherDetailsElem) {
        const otherDetails = otherDetailsElem.innerText;
        const index = otherDetails.indexOf(' · ');
        company = otherDetails.substring(0, index);
        workLocation = otherDetails.substring(index + 3);
        const styleStart = workLocation.lastIndexOf('(');
        const styleEnd = workLocation.lastIndexOf(')');
        workStyle = (styleStart !== -1 && styleEnd !== -1) ? workLocation.substring(styleStart + 1, styleEnd) : '';
        workLocation = styleStart !== -1 ? workLocation.substring(0, styleStart).trim() : workLocation;
    }
    return { jobId, title, company, workLocation, workStyle };
}

// Send job details to backend API
function sendJobToBackend(job) {
    fetch('http://localhost:5000/applied-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
    })
    .then(res => res.json())
    .then(data => {
        console.log('Job sent to backend:', data);
    })
    .catch(err => {
        console.error('Error sending job:', err);
    });
}

// Main logic: extract jobs and send to backend
function processJobs() {
    const jobCards = getJobCards();
    if (jobCards.length === 0) {
        alert('No jobs found on this page.');
        return;
    }
    jobCards.forEach(card => {
        const job = extractJobDetails(card);
        sendJobToBackend(job);
    });
    alert(`Processed ${jobCards.length} jobs and sent to backend.`);
}

// Run when extension is triggered
processJobs();