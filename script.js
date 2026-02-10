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
const puzzleImageUrl = 'assets/photos/puzzle.jpg';

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    currentPage: 'greeting',
    currentFolder: null,
    puzzlePieces: [],
    snappedPieces: 0,
    puzzleGrid: 3, // 3x3 grid
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
        
        // Manage background music based on page
        if (pageName === 'memories') {
            playBackgroundAudio();
        } else {
            pauseBackgroundAudio();
        }
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

const photoModal = document.getElementById('photoModal');
const modalClose = document.querySelector('.modal-close');
const foldersGrid = document.getElementById('foldersGrid');
let loadedFolders = [];
let currentAudio = null;
const photoOverlay = document.getElementById('photoOverlay');
const overlayImage = document.getElementById('overlayImage');
const overlayCaption = document.getElementById('overlayCaption');
const overlayClose = document.getElementById('overlayClose');

// Background music tracking
let backgroundAudio = null;
const backgroundMusicSrc = 'assets/ost/GehraHua.mp3';

function playAudio(src) {
    pauseBackgroundAudio();
    if (!src) return;
    try {
        currentAudio = new Audio(src);
        currentAudio.loop = true;
        currentAudio.volume = 0.45;
        currentAudio.play().catch(()=>{});
    } catch (e) {
        currentAudio = null;
    }
}

function stopAudio() {
    if (currentAudio) {
        try { currentAudio.pause(); } catch(e) {}
        currentAudio = null;
    }
}

function playBackgroundAudio() {
    if (!backgroundAudio) {
        try {
            backgroundAudio = new Audio(backgroundMusicSrc);
            backgroundAudio.loop = true;
            backgroundAudio.volume = 0.3;
            backgroundAudio.play().catch(()=>{});
        } catch (e) {
            backgroundAudio = null;
        }
    } else if (backgroundAudio.paused) {
        backgroundAudio.play().catch(()=>{});
    }
}

function pauseBackgroundAudio() {
    if (backgroundAudio && !backgroundAudio.paused) {
        try { backgroundAudio.pause(); } catch(e) {}
    }
}

function stopBackgroundAudio() {
    if (backgroundAudio) {
        try { backgroundAudio.pause(); } catch(e) {}
        backgroundAudio = null;
    }
}

// Load folder manifest (assets/folders.json) and render folders
async function loadAndRenderFolders() {
    let folders = null;
    // Try to fetch external manifest first (works on http/localhost). If that fails
    // (for example when opening index.html via file://), fall back to the embedded manifest.
    try {
        const resp = await fetch('assets/folders.json');
        if (resp.ok) {
            folders = await resp.json();
        } else {
            console.warn('Could not load assets/folders.json, using defaults');
        }
    } catch (e) {
        console.warn('Error fetching assets/folders.json, using defaults', e);
    }

    // Fallback if manifest missing
    if (!folders) {
        folders = [
            { key: 'first-date', label: 'First Date' },
            { key: 'our-trip', label: 'Our Trip' },
            { key: 'silly-us', label: 'Silly Us' },
            { key: 'small-moments', label: 'Small Moments' },
            { key: 'secret-message', label: 'Secret Message', secret: true }
        ];
    }

    loadedFolders = folders;
    renderFolders(folders);
}

function renderFolders(folders) {
    foldersGrid.innerHTML = '';
    folders.forEach((f, i) => {
        const item = document.createElement('div');
        item.className = 'folder-item';
        if (f.secret) item.classList.add('secret-folder');
        item.dataset.folder = f.key;

        const icon = document.createElement('div');
        icon.className = 'folder-icon';
        // Attempt to load a custom icon from assets/icons/<folder>.(png|jpg|svg|jpeg|webp)
        // If no custom icon exists, fall back to the emoji icon.
        const iconImg = new Image();
        iconImg.className = 'folder-image';
        const exts = ['png', 'jpg', 'svg', 'jpeg', 'webp'];
        let tryIndex = 0;

        function tryLoadIcon() {
            if (tryIndex >= exts.length) {
                // No icon found, use default emoji
                icon.textContent = f.secret ? '🔒' : '📁';
                return;
            }

            const ext = exts[tryIndex++];
            const src = `assets/icons/${f.key}.${ext}`;
            iconImg.onload = function() {
                icon.textContent = '';
                icon.appendChild(iconImg);
            };
            iconImg.onerror = tryLoadIcon;
            // Start loading
            iconImg.src = src;
        }

        // Kick off icon loading
        tryLoadIcon();

        const label = document.createElement('p');
        label.className = 'folder-label';
        label.textContent = f.label || f.key;

        item.appendChild(icon);
        item.appendChild(label);

        // Click handling
        item.addEventListener('click', () => {
            // Play mapped audio for this folder if present
            if (f.audio) playAudio(f.audio);

            if (f.secret || f.key === 'secret-message') {
                openPuzzle();
                return;
            }

            // If manifest provided explicit files, use them
            if (f.files && Array.isArray(f.files) && f.files.length > 0) {
                openPhotoGalleryFromFiles(f);
                return;
            }

                // If we have an entry in memoriesData, use it. Try to resolve similar keys
                const memKey = findMemoriesDataKey(f.key);
                if (memKey) {
                    openPhotoGallery(memKey);
                    return;
                }

            // Otherwise, show the modal with a helpful message
            openEmptyFolderModal(f);
        });

        // Staggered animation delay
        item.style.animationDelay = (0.1 * (i + 1)) + 's';

        foldersGrid.appendChild(item);
    });
}

    /**
     * Try to find a matching key in memoriesData for a manifest key.
     * Normalizes by removing non-alphanumerics and comparing lowercase.
     */
    function findMemoriesDataKey(manifestKey) {
        if (!manifestKey) return null;
        if (memoriesData[manifestKey]) return manifestKey;
        const norm = manifestKey.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const k of Object.keys(memoriesData)) {
            const kn = k.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (kn === norm) return k;
        }
        return null;
    }

function openEmptyFolderModal(folder) {
    const gallery = document.querySelector('.photos-gallery');
    gallery.innerHTML = '';

    const info = document.createElement('div');
    info.className = 'photo-item';

    const frame = document.createElement('div');
    frame.className = 'photo-frame';
    frame.style.display = 'flex';
    frame.style.justifyContent = 'center';
    frame.style.alignItems = 'center';
    frame.style.height = '140px';

    const msg = document.createElement('p');
    msg.className = 'photo-caption';
    msg.textContent = `No photos yet. Add images to assets/${folder.key}/ or update assets/folders.json`;

    info.appendChild(frame);
    info.appendChild(msg);
    gallery.appendChild(info);

    photoModal.classList.add('active');
}

// Show full-size overlay for an image
function showPhotoOverlay(src, caption) {
    overlayImage.src = src;
    overlayImage.alt = caption || '';
    overlayCaption.textContent = caption || '';
    photoOverlay.classList.add('active');
}

function hidePhotoOverlay() {
    photoOverlay.classList.remove('active');
    overlayImage.src = '';
    overlayCaption.textContent = '';
}

overlayClose.addEventListener('click', hidePhotoOverlay);
photoOverlay.addEventListener('click', (e) => {
    if (e.target === photoOverlay) hidePhotoOverlay();
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

        // Make photos clickable to open full-size overlay
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            // Build full-size src: if src is already full path, use it; else use basePath
            let fullSrc = photo.src;
            if (!/^https?:\/\//.test(fullSrc) && !fullSrc.startsWith('data:')) {
                if (folder.basePath) fullSrc = folder.basePath + fullSrc;
            }
            showPhotoOverlay(fullSrc, photo.caption);
        });

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

    // If manifest maps audio to this folder, play it
    const manifestEntry = loadedFolders.find(f => f.key === folderKey);
    if (manifestEntry && manifestEntry.audio) {
        playAudio(manifestEntry.audio);
    }
}

/**
 * Open photo gallery when manifest provides a folder object with files or a folder key
 * @param {object} folderObj - folder object from manifest { key, label, files }
 */
function openPhotoGalleryFromFiles(folderObj) {
    const gallery = document.querySelector('.photos-gallery');
    gallery.innerHTML = '';

    const basePath = folderObj.basePath || `assets/${folderObj.key}/`;

    folderObj.files.forEach((file) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        const photoFrame = document.createElement('div');
        photoFrame.className = 'photo-frame';

        const img = document.createElement('img');
        // Support either string filenames or objects { src|file, caption }
        let fileSrc = '';
        let fileCaption = '';
        if (typeof file === 'string') {
            fileSrc = file;
        } else if (typeof file === 'object' && file !== null) {
            fileSrc = file.src || file.file || '';
            fileCaption = file.caption || file.captionText || '';
        }

        // If the file entry looks like a full URL, use it directly; otherwise join with basePath
        const src = /^(https?:)?\/\//.test(fileSrc) ? fileSrc : (basePath + fileSrc);
        img.src = src;
        img.alt = fileCaption || folderObj.label || folderObj.key;

        // Click to open overlay
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => showPhotoOverlay(src, fileCaption));

        photoFrame.appendChild(img);

        const caption = document.createElement('p');
        caption.className = 'photo-caption';
        caption.textContent = fileCaption || '';

        photoItem.appendChild(photoFrame);
        photoItem.appendChild(caption);

        gallery.appendChild(photoItem);
    });

    photoModal.classList.add('active');

    if (folderObj && folderObj.audio) {
        playAudio(folderObj.audio);
    }
}

/**
 * Close photo gallery modal
 */
modalClose.addEventListener('click', function() {
    photoModal.classList.remove('active');
    stopAudio();
    playBackgroundAudio();
});

photoModal.addEventListener('click', function(e) {
    if (e.target === photoModal) {
        photoModal.classList.remove('active');
        stopAudio();
        playBackgroundAudio();
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
    stopAudio();
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

        // Set piece dimensions
        pieceElement.style.width = pieceWidth + 'px';
        pieceElement.style.height = pieceHeight + 'px';

        // Set background image with correct position
        // The background size is the full container size, and we offset to show the correct piece
        pieceElement.style.backgroundImage = `url('${puzzleImageUrl}')`;
        pieceElement.style.backgroundSize = `${containerWidth}px ${containerHeight}px`;
        pieceElement.style.backgroundPosition = `${-piece.col * pieceWidth}px ${-piece.row * pieceHeight}px`;

        // Random position around the board initially - scatter outside grid
        const randomX = Math.random() * (containerWidth - pieceWidth);
        const randomY = Math.random() * (containerHeight - pieceHeight);

        pieceElement.style.left = randomX + 'px';
        pieceElement.style.top = randomY + 'px';
        pieceElement.style.zIndex = '20'; // Floating pieces visible over snapped ones

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
        element.style.zIndex = '100'; // Dragging piece goes on top

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
            element.style.zIndex = '20'; // Floating piece stays on top of snapped pieces
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
    element.style.zIndex = '10'; // Snapped pieces in the back
    pieceData.snapped = true;
    state.snappedPieces++;

    // Try to snap adjacent pieces magnetically
    snapAdjacentPieces(pieceData);

    // Check if puzzle is complete
    if (state.snappedPieces === state.puzzleGrid * state.puzzleGrid) {
        completePuzzle();
    }
}

/**
 * Snap adjacent pieces magnetically when a piece is placed
 */
function snapAdjacentPieces(placedPiece) {
    const gridSize = state.puzzleGrid;
    const adjacentOffsets = [
        { row: -1, col: 0 }, // top
        { row: 1, col: 0 },  // bottom
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }   // right
    ];

    adjacentOffsets.forEach(offset => {
        const adjacentRow = placedPiece.row + offset.row;
        const adjacentCol = placedPiece.col + offset.col;

        // Check if adjacent position is within grid
        if (adjacentRow >= 0 && adjacentRow < gridSize && adjacentCol >= 0 && adjacentCol < gridSize) {
            // Find the piece at this position
            const adjacentPiece = state.puzzlePieces.find(
                p => p.row === adjacentRow && p.col === adjacentCol && !p.snapped
            );

            if (adjacentPiece) {
                // Check if it's close enough to snap
                const distX = Math.abs(adjacentPiece.offsetX - adjacentPiece.correctX);
                const distY = Math.abs(adjacentPiece.offsetY - adjacentPiece.correctY);
                const pieceWidth = adjacentPiece.element.offsetWidth;

                // Snap if within 40% of piece size
                if (distX < pieceWidth * 0.4 && distY < pieceWidth * 0.4) {
                    snapPiece(adjacentPiece.element, adjacentPiece);
                }
            }
        }
    });
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
    loadAndRenderFolders();
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
