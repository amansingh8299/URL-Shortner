
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('url-form');
    const urlInput = document.getElementById('url-input');
    const resultDiv = document.getElementById('result');
    const analyticsDiv = document.getElementById('analytics');
    const copyButton = document.getElementById('copy-button');
    const resultContainer = document.getElementById('result-container');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const originalURL = urlInput.value;
        try {
            const response = await fetch('/url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: originalURL })
            });

            const result = await response.json();
            if (response.ok) {
                resultDiv.innerHTML = `Short URL: <a href="${result.shortURL}" target="_blank">${result.shortURL}</a>`;
                urlInput.value = '';

                // Show the copy button and enable it
                copyButton.style.display = 'inline-block';
                copyButton.disabled = false;

                // Set the click event for the copy button
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(result.shortURL)
                        .then(() => {
                            copyButton.textContent = 'Copied!';
                            copyButton.disabled = true; // Disable after copying
                            setTimeout(() => {
                                copyButton.textContent = 'Copy';
                                copyButton.disabled = false; // Re-enable button after timeout
                            }, 2000); // Reset after 2 seconds
                        })
                        .catch((error) => {
                            console.error('Copy failed:', error);
                            copyButton.textContent = 'Failed to copy';
                        });
                };
            } else {
                resultDiv.innerHTML = `Error: ${result.error || 'An error occurred'}`;
                copyButton.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerHTML = 'An error occurred. Please try again.';
            copyButton.style.display = 'none';
        }
    });

    const fetchAnalytics = async (shortId) => {
        try {
            const response = await fetch(`/url/analytics/${shortId}`);
            const data = await response.json();

            if (response.ok) {
                analyticsDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            } else {
                analyticsDiv.innerHTML = `Error: ${data.error || 'An error occurred'}`;
            }
        } catch (error) {
            console.error('Error:', error);
            analyticsDiv.innerHTML = 'An error occurred. Please try again.';
        }
    };
});

