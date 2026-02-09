/* ============================================
   MEMORY LANE - JavaScript
   ============================================ */

// ============================================
// DATA: Memories and photos
// ============================================
const memoriesData = {
    'first-date': {
        label: 'First Date',
        photos: [
            {
                src: 'https://via.placeholder.com/280x220/f5c5a8/8b6f67?text=Coffee+Date',
                caption: 'Our first coffee together'
            },
            {
                src: 'https://via.placeholder.com/280x220/e8b4a0/8b6f67?text=Sunset+Walk',
                caption: 'Walking at sunset'
            },
            {
                src: 'https://via.placeholder.com/280x220/f0cdc2/8b6f67?text=Smile',
                caption: 'That first smile'
            }
        ]
    },
    'our-trip': {
        label: 'Our Trip',
        photos: [
            {
                src: 'https://via.placeholder.com/280x220/f5d7c8/8b6f67?text=Mountain+View',
                caption: 'Mountain peaks we climbed'
            },
            {
                src: 'https://via.placeholder.com/280x220/e8c5b8/8b6f67?text=Beach+Day',
                caption: 'Beach memories'
            },
            {
                src: 'https://via.placeholder.com/280x220/f2d1c3/8b6f67?text=Adventure',
                caption: 'Every moment was perfect'
            }
        ]
    },
    'silly-us': {
        label: 'Silly Us',
        photos: [
            {
                src: 'https://via.placeholder.com/280x220/fcd5c4/8b6f67?text=Goofy+Face',
                caption: 'Making silly faces'
            },
            {
                src: 'https://via.placeholder.com/280x220/f4c9ba/8b6f67?text=Laugh',
                caption: 'Laughing so hard'
            },
            {
                src: 'https://via.placeholder.com/280x220/ead0c5/8b6f67?text=Moment',
                caption: 'Just us being us'
            }
        ]
    },
    'small-moments': {
        label: 'Small Moments',
        photos: [
            {
                src: 'https://via.placeholder.com/280x220/f6d4c9/8b6f67?text=Morning+Tea',
                caption: 'Quiet mornings together'
            },
            {
                src: 'https://via.placeholder.com/280x220/ead8cf/8b6f67?text=Hands',
                caption: 'Our hands holding yours'
            },
            {
                src: 'https://via.placeholder.com/280x220/f1cdc0/8b6f67?text=Home',
                caption: 'Home is you'
            }
        ]
    }
};

// Puzzle image URL for secret message
const puzzleImageUrl = 'https://via.placeholder.com/400x400/f5c5a8/8b6f67?text=Our+Love';

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    currentPage: 'greeting',
    currentFolder: null,
    puzzlePieces: [],
    snappedPieces: 0,
    puzzleGrid: 4, // 4x4 grid
    isDraggingPiece: false
};

// ============================================
// PAGE NAVIGATION
// ============================================

/**
 * Switch to a different page
 * @param {string} pageName - The page ID to switch to
 */
function switchPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show the requested page
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
        state.currentPage = pageName;
    }
}

// ============================================
// GREETING CARD FUNCTIONALITY
// ============================================

const cardElement = document.getElementById('card');
const openMemoriesBtn = document.getElementById('openMemoriesBtn');

/**
 * Handle card click to open/close
 */
cardElement.addEventListener('click', function(e) {
    // Only toggle on card element, not on button
    if (e.target !== openMemoriesBtn && !openMemoriesBtn.contains(e.target)) {
        cardElement.classList.toggle('opened');
    }
});

/**
 * Handle opening memories from card button
 */
openMemoriesBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    switchPage('memories');
});

// ============================================
// MEMORIES & FOLDERS FUNCTIONALITY
// ============================================

const folderItems = document.querySelectorAll('.folder-item');
const photoModal = document.getElementById('photoModal');
const modalClose = document.querySelector('.modal-close');

/**
 * Handle folder click to open photos
 */
folderItems.forEach(item => {
    item.addEventListener('click', function() {
        const folderKey = this.dataset.folder;

        if (folderKey === 'secret-message') {
            // Open puzzle page instead
            openPuzzle();
        } else {
            // Open photo gallery
            openPhotoGallery(folderKey);
        }
    });
});

/**
 * Open photo gallery modal for a folder
 * @param {string} folderKey - The folder key
 */
function openPhotoGallery(folderKey) {
    const folder = memoriesData[folderKey];
    if (!folder) return;

    const gallery = document.querySelector('.photos-gallery');
    gallery.innerHTML = ''; // Clear previous content

    // Populate photos
    folder.photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        const photoFrame = document.createElement('div');
        photoFrame.className = 'photo-frame';

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.caption;

        photoFrame.appendChild(img);

        const caption = document.createElement('p');
        caption.className = 'photo-caption';
        caption.textContent = photo.caption;

        photoItem.appendChild(photoFrame);
        photoItem.appendChild(caption);

        gallery.appendChild(photoItem);
    });

    // Show modal
    photoModal.classList.add('active');
}

/**
 * Close photo gallery modal
 */
modalClose.addEventListener('click', function() {
    photoModal.classList.remove('active');
});

photoModal.addEventListener('click', function(e) {
    if (e.target === photoModal) {
        photoModal.classList.remove('active');
    }
});

// ============================================
// PUZZLE FUNCTIONALITY
// ============================================

const puzzleContainer = document.querySelector('.puzzle-pieces-container');
const puzzlePage = document.getElementById('puzzlePage');
const finalMessageOverlay = document.getElementById('finalMessageOverlay');
const puzzleBackBtn = document.getElementById('puzzleBackBtn');

/**
 * Open the puzzle page
 */
function openPuzzle() {
    switchPage('puzzle');
    generatePuzzlePieces();
}

/**
 * Go back from puzzle page to memories
 */
puzzleBackBtn.addEventListener('click', function() {
    switchPage('memories');
});

/**
 * Generate puzzle pieces from the image
 */
function generatePuzzlePieces() {
    puzzleContainer.innerHTML = ''; // Clear previous pieces
    state.puzzlePieces = [];
    state.snappedPieces = 0;

    const gridSize = state.puzzleGrid;
    const containerRect = puzzleContainer.getBoundingClientRect();
    const containerWidth = puzzleContainer.offsetWidth;
    const containerHeight = puzzleContainer.offsetHeight;

    const pieceWidth = containerWidth / gridSize;
    const pieceHeight = containerHeight / gridSize;

    // Create pieces in random order
    const pieces = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            pieces.push({ row, col });
        }
    }

    // Shuffle pieces
    pieces.sort(() => Math.random() - 0.5);

    // Create DOM elements for each piece
    pieces.forEach((piece, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'puzzle-piece';
        pieceElement.dataset.row = piece.row;
        pieceElement.dataset.col = piece.col;
        pieceElement.dataset.index = index;

        // Set background image with correct position
        pieceElement.style.backgroundImage = `url('${puzzleImageUrl}')`;
        pieceElement.style.backgroundSize = `${containerWidth * gridSize}px ${containerHeight * gridSize}px`;
        pieceElement.style.backgroundPosition = `${-piece.col * pieceWidth}px ${-piece.row * pieceHeight}px`;

        // Set piece dimensions
        pieceElement.style.width = pieceWidth + 'px';
        pieceElement.style.height = pieceHeight + 'px';

        // Random position around the board initially
        const randomX = Math.random() * (containerWidth - pieceWidth);
        const randomY = Math.random() * (containerHeight - pieceHeight) - containerHeight * 0.5;

        pieceElement.style.left = randomX + 'px';
        pieceElement.style.top = randomY + 'px';

        // Store piece data
        const pieceData = {
            element: pieceElement,
            row: piece.row,
            col: piece.col,
            correctX: piece.col * pieceWidth,
            correctY: piece.row * pieceHeight,
            snapped: false,
            offsetX: 0,
            offsetY: 0
        };

        state.puzzlePieces.push(pieceData);

        // Add event listeners
        addPieceEventListeners(pieceElement, pieceData, pieceWidth, pieceHeight);

        puzzleContainer.appendChild(pieceElement);
    });
}

/**
 * Add drag and drop event listeners to puzzle pieces
 */
function addPieceEventListeners(element, pieceData, pieceWidth, pieceHeight) {
    let isDragging = false;
    let startX, startY;

    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag);

    function startDrag(e) {
        if (pieceData.snapped) return; // Can't drag snapped pieces

        isDragging = true;
        state.isDraggingPiece = true;
        element.style.zIndex = '100';

        // Get initial position
        const rect = element.getBoundingClientRect();
        const containerRect = puzzleContainer.getBoundingClientRect();

        if (e.type.includes('touch')) {
            startX = e.touches[0].clientX - rect.left;
            startY = e.touches[0].clientY - rect.top;
        } else {
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
        }

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e) {
        if (!isDragging) return;

        const containerRect = puzzleContainer.getBoundingClientRect();

        let clientX, clientY;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        let x = clientX - containerRect.left - startX;
        let y = clientY - containerRect.top - startY;

        // Keep piece within bounds
        x = Math.max(0, Math.min(x, puzzleContainer.offsetWidth - pieceWidth));
        y = Math.max(0, Math.min(y, puzzleContainer.offsetHeight - pieceHeight));

        element.style.left = x + 'px';
        element.style.top = y + 'px';

        // Store offset for snap checking
        pieceData.offsetX = x;
        pieceData.offsetY = y;
    }

    function stopDrag() {
        isDragging = false;
        state.isDraggingPiece = false;

        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);

        // Check if piece is close to correct position (snap tolerance)
        const snapTolerance = pieceWidth * 0.2; // 20% of piece size
        const distX = Math.abs(pieceData.offsetX - pieceData.correctX);
        const distY = Math.abs(pieceData.offsetY - pieceData.correctY);

        if (distX < snapTolerance && distY < snapTolerance) {
            // Snap to correct position
            snapPiece(element, pieceData);
        } else {
            element.style.zIndex = Math.floor(Math.random() * 50); // Reset z-index
        }
    }
}

/**
 * Snap a puzzle piece to its correct position
 */
function snapPiece(element, pieceData) {
    element.style.left = pieceData.correctX + 'px';
    element.style.top = pieceData.correctY + 'px';
    element.classList.add('snapped');
    pieceData.snapped = true;
    state.snappedPieces++;

    // Check if puzzle is complete
    if (state.snappedPieces === state.puzzleGrid * state.puzzleGrid) {
        completePuzzle();
    }
}

/**
 * Handle puzzle completion
 */
function completePuzzle() {
    // Fade out puzzle board
    setTimeout(() => {
        puzzleContainer.style.opacity = '0';
        puzzleContainer.style.transition = 'opacity 0.8s ease';

        // Show final message overlay after a short delay
        setTimeout(() => {
            finalMessageOverlay.classList.add('active');
        }, 400);
    }, 300);
}

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Soft auto-open of card after a delay for better UX
    // Users can still interact with the card
});

// Prevent body scroll on mobile when modal is open
const observeModal = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
            if (photoModal.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else if (!finalMessageOverlay.classList.contains('active')) {
                document.body.style.overflow = 'auto';
            }
        }
    });
});

observeModal.observe(photoModal, { attributes: true });
observeModal.observe(finalMessageOverlay, { attributes: true });

console.log('✨ Memory Lane loaded. Click the card to begin...');
