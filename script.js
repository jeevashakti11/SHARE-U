// Array to store files (mimicking storage)
let files = [];

// Function to retrieve files
function getFiles() {
    return files;
}

// Function to save files to localStorage
function saveFiles() {
    try {
        localStorage.setItem("files", JSON.stringify(files));
    } catch (e) {
        alert("Local storage limit reached. Consider switching to server storage for unlimited uploads.");
    }
}

// Load files from localStorage (for persistence)
function loadFiles() {
    const savedFiles = JSON.parse(localStorage.getItem("files"));
    if (savedFiles) {
        files = savedFiles;
    }
}

// Function to display files on the user page (with optional filtered files)
function displayFiles(filteredFiles = null) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    const filesToShow = filteredFiles || getFiles();

    if (filesToShow.length === 0) {
        const noResults = document.createElement('div');
        noResults.textContent = 'No files found.';
        noResults.className = 'file-item';
        fileList.appendChild(noResults);
        return;
    }

    filesToShow.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const downloadButton = document.createElement('a');
        downloadButton.textContent = 'Download';
        downloadButton.href = file.url;
        downloadButton.download = file.name;
        downloadButton.className = 'download-btn';

        fileItem.appendChild(fileName);
        fileItem.appendChild(downloadButton);
        fileList.appendChild(fileItem);
    });
}

// Function to display files on the admin page
function renderAdminFiles() {
    const adminFileList = document.getElementById('admin-file-list');
    adminFileList.innerHTML = '';
    getFiles().forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => {
            files.splice(index, 1);
            saveFiles();
            renderAdminFiles();
            displayFiles();
        };

        fileItem.appendChild(fileName);
        fileItem.appendChild(deleteButton);
        adminFileList.appendChild(fileItem);
    });
}

// Function to upload a file (admin only)
function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            files.push({ name: file.name, url: e.target.result });
            saveFiles();
            renderAdminFiles();
            displayFiles();
            fileInput.value = ''; // Clear input
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please select a file to upload.");
    }
}

// Function to search files
function searchFiles() {
    const query = document.getElementById('search').value.toLowerCase();
    const filteredFiles = getFiles().filter(file => file.name.toLowerCase().includes(query));
    displayFiles(filteredFiles);
}

// Page load transition
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "0";
    document.body.style.transition = "opacity 1.5s ease-in-out";
    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
});

// Initialize files from storage and display them
loadFiles();
displayFiles();
