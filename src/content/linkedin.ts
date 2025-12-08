// LinkedIn Content Script
// This script runs on LinkedIn pages and enables direct insertion of formatted posts

console.log('LinkedIn Post Formatter: Content script loaded');

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'insertFormatted') {
    insertFormattedPost(request.content);
    sendResponse({ success: true });
  }
  return true;
});

function insertFormattedPost(content: string) {
  // Try to find LinkedIn's post composer
  const selectors = [
    // Main feed composer
    '.ql-editor[contenteditable="true"]',
    '[data-placeholder="Start a post"]',
    '.share-box-feed-entry__trigger',
    // After clicking "Start a post"
    '.ql-editor.ql-blank',
    // Messaging
    '.msg-form__contenteditable',
  ];

  let composer: HTMLElement | null = null;

  for (const selector of selectors) {
    composer = document.querySelector(selector) as HTMLElement;
    if (composer) break;
  }

  if (!composer) {
    // If composer not found, try to click "Start a post" button
    const startPostButton = document.querySelector('.share-box-feed-entry__trigger') as HTMLElement;
    if (startPostButton) {
      startPostButton.click();

      // Wait for composer to appear
      setTimeout(() => {
        composer = document.querySelector('.ql-editor[contenteditable="true"]') as HTMLElement;
        if (composer) {
          insertIntoComposer(composer, content);
        } else {
          showNotification('Please click on the post composer and try again');
        }
      }, 500);
      return;
    } else {
      showNotification('LinkedIn post composer not found. Please open the composer manually.');
      return;
    }
  }

  insertIntoComposer(composer, content);
}

function insertIntoComposer(composer: HTMLElement, content: string) {
  // Clear existing content
  composer.innerHTML = '';

  // Convert plain text to LinkedIn's format
  const formattedHTML = content
    .split('\n')
    .map(line => {
      if (line.trim() === '') {
        return '<p><br></p>';
      }
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join('');

  composer.innerHTML = formattedHTML;

  // Trigger input event to notify LinkedIn
  composer.dispatchEvent(new Event('input', { bubbles: true }));
  composer.dispatchEvent(new Event('change', { bubbles: true }));

  // Focus on the composer
  composer.focus();

  showNotification('✓ Post inserted successfully!');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message: string) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #0a66c2;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add a floating button for quick access (optional)
function addFloatingButton() {
  // Only add on feed page
  if (!window.location.pathname.includes('/feed')) return;

  const button = document.createElement('button');
  button.innerHTML = '✨';
  button.title = 'Open LinkedIn Post Formatter';
  button.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0a66c2 0%, #004182 100%);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);
    z-index: 999998;
    transition: all 0.3s ease;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = '0 6px 16px rgba(10, 102, 194, 0.6)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(10, 102, 194, 0.4)';
  });

  button.addEventListener('click', () => {
    // Open extension popup
    chrome.runtime.sendMessage({ action: 'openPopup' });
  });

  document.body.appendChild(button);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addFloatingButton);
} else {
  addFloatingButton();
}
