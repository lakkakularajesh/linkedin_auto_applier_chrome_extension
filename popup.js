document.getElementById('extractJobs').addEventListener('click', async () => {
  document.getElementById('status').innerText = 'Extracting...';
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      files: ['content.js']
    });
  });
});