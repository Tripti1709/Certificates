// Global variables
let videoCompleted = false;
let certificateData = null;

// Course mapping
const COURSE_NAMES = {
    'demon-slayer-basics': 'Demon Slayer Breathing Techniques - Basics',
    'water-breathing': 'Water Breathing Forms',
    'flame-breathing': 'Flame Breathing Mastery',
    'thunder-breathing': 'Thunder Breathing Speed Training',
    'advanced-combat': 'Advanced Combat Techniques'
};

// DOM Elements
const video = document.getElementById('trainingVideo');
const progressFill = document.getElementById('progressFill');
const completionOverlay = document.getElementById('completionOverlay');
const certificateForm = document.getElementById('certificateForm');
const certForm = document.getElementById('certForm');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const downloadBtn = document.getElementById('downloadBtn');
const emailBtn = document.getElementById('emailBtn');
const closeModal = document.getElementById('closeModal');

// Video event listeners
video.addEventListener('timeupdate', handleVideoProgress);
video.addEventListener('ended', handleVideoEnd);

// Form event listeners
certForm.addEventListener('submit', handleFormSubmit);
document.getElementById('terms').addEventListener('change', updateSubmitButton);

// Modal event listeners
downloadBtn.addEventListener('click', downloadCertificate);
emailBtn.addEventListener('click', emailCertificate);
closeModal.addEventListener('click', closeSuccessModal);

// Video progress tracking
function handleVideoProgress() {
    if (!video.duration) return;
    
    const progress = (video.currentTime / video.duration) * 100;
    progressFill.style.width = progress + '%';
    
    // Check if video is 95% completed
    if (progress >= 95 && !videoCompleted) {
        completeVideo();
    }
}

function handleVideoEnd() {
    if (!videoCompleted) {
        completeVideo();
    }
    showCompletionOverlay();
}

function completeVideo() {
    videoCompleted = true;
    unlockForm();
    progressFill.style.width = '100%';
}

function showCompletionOverlay() {
    completionOverlay.classList.add('show');
    setTimeout(() => {
        completionOverlay.classList.remove('show');
    }, 3000);
}

function unlockForm() {
    certificateForm.classList.add('unlocked');
    updateSubmitButton();
    
    // Smooth scroll to form
    setTimeout(() => {
        certificateForm.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 500);
}

function updateSubmitButton() {
    const termsChecked = document.getElementById('terms').checked;
    submitBtn.disabled = !videoCompleted || !termsChecked;
}

// Form validation
function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const course = document.getElementById('course').value;
    const terms = document.getElementById('terms').checked;
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    // Validate first name
    if (!firstName) {
        showError('firstNameError', 'First name is required');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName) {
        showError('lastNameError', 'Last name is required');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate course
    if (!course) {
        showError('courseError', 'Please select a course');
        isValid = false;
    }
    
    // Validate terms
    if (!terms) {
        alert('Please agree to the terms and conditions');
        isValid = false;
    }
    
    // Validate video completion
    if (!videoCompleted) {
        alert('Please complete the video first');
        isValid = false;
    }
    
    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    // Collect form data
    const formData = new FormData(certForm);
    certificateData = {
        id: generateUniqueId(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        organization: formData.get('organization') || '',
        course: formData.get('course'),
        completedAt: new Date(),
        videoCompleted: true
    };
    
    // Show loading state
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Generating...';
    submitBtn.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = '<span class="btn-icon">🏷️</span> Generate Certificate';
        submitBtn.disabled = false;
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        certForm.reset();
        document.getElementById('terms').checked = false;
        updateSubmitButton();
    }, 1500);
}

function generateUniqueId() {
    return 'cert-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Modal functions
function showSuccessModal() {
    successModal.classList.add('show');
}

function closeSuccessModal() {
    successModal.classList.remove('show');
}

function downloadCertificate() {
    if (!certificateData) return;
    
    generateCertificatePDF(certificateData);
}

function emailCertificate() {
    alert('Certificate would be emailed to: ' + certificateData.email);
}

// PDF Generation using jsPDF
function generateCertificatePDF(certificate) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    // Certificate dimensions
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    
    // Background - light gray to mimic concrete texture
    pdf.setFillColor(245, 245, 245);
    pdf.rect(0, 0, width, height, 'F');
    
    // Add subtle texture pattern
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.1);
    for (let i = 0; i < width; i += 10) {
        pdf.line(i, 0, i, height);
    }
    for (let i = 0; i < height; i += 10) {
        pdf.line(0, i, width, i);
    }
    
    // Decorative borders
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(3);
    pdf.rect(15, 15, width - 30, height - 30);
    
    pdf.setLineWidth(1);
    pdf.rect(20, 20, width - 40, height - 40);
    
    // Title
    pdf.setFontSize(36);
    pdf.setTextColor(50, 50, 50);
    pdf.text('CERTIFICATE OF COMPLETION', width / 2, 50, { align: 'center' });
    
    // Decorative line under title
    pdf.setLineWidth(2);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(width / 2 - 80, 58, width / 2 + 80, 58);
    
    // Subtitle
    pdf.setFontSize(16);
    pdf.setTextColor(80, 80, 80);
    pdf.text('This is to certify that', width / 2, 75, { align: 'center' });
    
    // Name with decorative styling
    pdf.setFontSize(28);
    pdf.setTextColor(20, 20, 20);
    const fullName = `${certificate.firstName} ${certificate.lastName}`;
    pdf.text(fullName, width / 2, 95, { align: 'center' });
    
    // Underline for name
    const nameWidth = pdf.getTextWidth(fullName);
    pdf.setLineWidth(1);
    pdf.line(width / 2 - nameWidth / 2 - 5, 100, width / 2 + nameWidth / 2 + 5, 100);
    
    // Course completion text
    pdf.setFontSize(16);
    pdf.setTextColor(80, 80, 80);
    pdf.text('has successfully completed the training course', width / 2, 115, { align: 'center' });
    
    // Course name
    pdf.setFontSize(20);
    pdf.setTextColor(40, 40, 40);
    const courseName = COURSE_NAMES[certificate.course] || certificate.course;
    pdf.text(`"${courseName}"`, width / 2, 135, { align: 'center' });
    
    // Date and details
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    const completionDate = certificate.completedAt.toLocaleDateString();
    pdf.text(`Date of Completion: ${completionDate}`, width / 2, 155, { align: 'center' });
    
    // Email
    pdf.text(`Email: ${certificate.email}`, width / 2, 170, { align: 'center' });
    
    // Organization (if provided)
    if (certificate.organization) {
        pdf.text(`Organization: ${certificate.organization}`, width / 2, 185, { align: 'center' });
    }
    
    // Certificate ID at bottom
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Certificate ID: ${certificate.id}`, width / 2, height - 25, { align: 'center' });
    
    // Decorative elements
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.circle(30, 30, 8);
    pdf.circle(width - 30, 30, 8);
    pdf.circle(30, height - 30, 8);
    pdf.circle(width - 30, height - 30, 8);
    
    // Download the PDF
    pdf.save(`certificate-${certificate.firstName}-${certificate.lastName}.pdf`);
}

function generateCertificateCanvas(userName, phoneNumber) {
    const img = new Image();
    img.src = 'certificate-template.png';

    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Add user image at specified position and size
        const userImageInput = document.getElementById('userImage');
        const userImageFile = userImageInput.files[0];
        if (userImageFile) {
            const userImage = new Image();
            const reader = new FileReader();
            reader.onload = function(e) {
                userImage.src = e.target.result;
                userImage.onload = function() {
                    // Position and size as per your reference code
                    ctx.drawImage(userImage, 410, 130, 180, 180);

                    // Draw user information after image is loaded
                    drawUserInfoAndDownload(canvas, ctx, userName, phoneNumber);
                };
            };
            reader.readAsDataURL(userImageFile);
        } else {
            // Draw user information if no image is uploaded
            drawUserInfoAndDownload(canvas, ctx, userName, phoneNumber);
        }
    };
}

function drawUserInfoAndDownload(canvas, ctx, userName, phoneNumber) {
    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB');
    const validDate = new Date();
    validDate.setMonth(validDate.getMonth() + 6);
    const validStr = validDate.toLocaleDateString('en-GB');

    const centerX = canvas.width / 2;
    let startY = 1100;

    ctx.fillText(`Name - ${userName}`, centerX, startY);
    ctx.fillText(`Phone No - ${phoneNumber}`, centerX, startY + 90);
    ctx.fillText(`Date - ${dateStr}`, centerX, startY + 180);
    ctx.fillText(`Validation Date - ${validStr}`, centerX, startY + 270);

    // Download the certificate
    const link = document.createElement('a');
    link.download = 'certificate.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Show modal and enable download after form submit
document.getElementById('certForm').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('successModal').style.display = 'flex';
});

// Download certificate on button click
document.getElementById('downloadBtn').addEventListener('click', function() {
    const userName = `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`;
    const phoneNumber = document.getElementById('phone').value;
    generateCertificateCanvas(userName, phoneNumber);
});

// Close modal
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('successModal').style.display = 'none';
});

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('trainingVideo');
    const form = document.getElementById('certForm');
    const submitBtn = document.getElementById('submitBtn');
    const completionOverlay = document.getElementById('completionOverlay');
    let lastTime = 0;
    let allowSeek = false;

    // Prevent seeking
    video.addEventListener('seeking', function () {
        if (!allowSeek && video.currentTime > lastTime + 0.5) {
            video.currentTime = lastTime;
        }
    });

    // Track progress
    video.addEventListener('timeupdate', function () {
        if (video.currentTime > lastTime) {
            lastTime = video.currentTime;
        }
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = ((video.currentTime / video.duration) * 100) + '%';
    });

    // When video ends
    video.addEventListener('ended', function () {
        allowSeek = true;
        submitBtn.disabled = false;
        completionOverlay.style.display = 'flex';
    });

    // Initially disable form submit
    submitBtn.disabled = true;
    completionOverlay.style.display = 'none';
});