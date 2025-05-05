let sectionCount = 1; // Keep track of the number of sections
const frontDropArea = document.getElementById(`front_image_label`);
const frontFileInput = document.getElementById(`front_image`);
const frontPreview = document.getElementById(`front_image_preview`);
const existingImageInputs = document.querySelectorAll('input[type="file"][id^="section_image_"]');
const addtionalImagesInput = document.querySelectorAll('input[type="file"][id^="additional_images_"]');

const quillInstances = new Map(); // Map to store Quill instances

console.log(`Quill Instances:`, quillInstances);

function populateDropdown(selectElement, filterFn) {
    cssClasses.filter(filterFn).forEach(cssClass => {
        const option = document.createElement('option');
        console.log(option);
        option.value = cssClass.class_name;
        option.textContent = cssClass.class_name;
        selectElement.appendChild(option);
    });
}


    document.getElementById('add-section-button').addEventListener('click', () => {
    sectionCount++;

    // Create a new section container
    const newSection = document.createElement('div');
    newSection.classList.add('section');

    // Add the new section fields
    newSection.innerHTML = `
        <label for="section_id_${sectionCount}">Section Id:</label>
        <input type="text" id="section_id_${sectionCount}" name="section_id[]" required>

        <label for="section_type_${sectionCount}">Section Type:</label>
        <select id="section_type_${sectionCount}" name="section_type[]" class="section-type" data-section="${sectionCount}" required>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="multiple_images">Multiple Images</option>
        </select>
        <label for="section_class_${sectionCount}">Section Style:</label>
        <select id="section_class_${sectionCount}" name="section_class[]" required>
        </select>
        <label for="content_align_${sectionCount}">Content alignment:</label>
            <select id="content_align_${sectionCount}" name="content_align_[]" required>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="center">Center</option>
            </select>

        <!-- Text Section Fields -->
        <div id="text_section_${sectionCount}" class="text-section">
            <label for="editor-container-${sectionCount}">Section Text:</label>
            <input type="hidden" name="section_text[]" id="quill-content_${sectionCount}">
            <div id="editor-container-${sectionCount}" class="editor-container"></div>
        </div>

        <!-- Image Section Fields -->
            
        <div id="image_section_${sectionCount}" class="image-section" style="display: none;">
            <label for="section_image_Alt_${sectionCount}">Image Alt</label>
            <input type="text" id="section_image_Alt_${sectionCount}" name="section_image_Alt[]" placeholder="Image Alt"></input>
            
            <label for="section_image_${sectionCount}" class="Image_loarder_area">
            <input type="file" id="section_image_${sectionCount}" name="section_image[]" accept="image/*" hidden>
            <div id="section_image_preview_${sectionCount}" class="image_preview">
                <p>Please Insert a Section Image</p>
            </div>
            </label>
        </div>

        <!-- Multiple Images Section Fields -->
        <div id="multiple_images_section_${sectionCount}" class="multiple-images-section" style="display: none;">
            <label for="additional_images_${sectionCount}" class="Image_loarder_area">
            <input type="file" id="additional_images_${sectionCount}" name="additional_images[]" accept="image/*" multiple hidden>
            <div id="additional_images_preview_${sectionCount}" class="image_preview">
                <p>Please Insert a Additional Images</p>
            </div>
            </label>
        </div>

        <button type="button" class="remove-section-button">Remove Section</button>
    `;

    // Append the new section to the container
    document.getElementById('sections-container').appendChild(newSection);

    // Initialize Quill for the new text section
    const quill = new Quill(`#editor-container-${sectionCount}`, {
        theme: 'snow',
        placeholder: 'Write something amazing...',
        modules: {
            toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean']
            ]
        }
    });

    // Store the Quill instance in the map
    quillInstances.set(sectionCount, quill);

    console.log(`Quill Instances:`, quillInstances);

  

    // Add event listener to the remove button
    newSection.querySelector('.remove-section-button').addEventListener('click', () => {
        newSection.remove();
    });

    // Populate the dropdowns
    const sectionClassDropdown = document.getElementById(`section_class_${sectionCount}`);
    const imageStyleDropdown = document.getElementById(`image_style_${sectionCount}`);

    populateDropdown(sectionClassDropdown, cssClass => !cssClass.class_name.includes('image'));

    // Add event listener to the section type dropdown
    newSection.querySelector('.section-type').addEventListener('change', handleSectionTypeChange);

    // Attach event listener to the new section's image input
    const newImageInput = document.getElementById(`section_image_${sectionCount}`);
    newImageInput.addEventListener('change', uploadSectionImage);

    // Attach event listener to the new multi's image input
    const newImagesInput = document.getElementById(`additional_images_${sectionCount}`);
    newImagesInput.addEventListener('change', uploadAditionalImages);
});

// Handle section type change
function handleSectionTypeChange(event) {
    const sectionNumber = event.target.getAttribute('data-section');
    const selectedType = event.target.value;

    const textSection = document.getElementById(`text_section_${sectionNumber}`);
    const imageSection = document.getElementById(`image_section_${sectionNumber}`);
    const multipleImagesSection = document.getElementById(`multiple_images_section_${sectionNumber}`);

    if (selectedType === 'text') {
        textSection.style.display = 'block';
        imageSection.style.display = 'none';
        multipleImagesSection.style.display = 'none';
    } else if (selectedType === 'image') {
        textSection.style.display = 'none';
        imageSection.style.display = 'block';
        multipleImagesSection.style.display = 'none';
    } else if (selectedType === 'multiple_images') {
        textSection.style.display = 'none';
        imageSection.style.display = 'none';
        multipleImagesSection.style.display = 'block';
    }
}
//handle front image upload preview
function uploadFrontImage() {
    let frontImage = URL.createObjectURL(frontFileInput.files[0]);
    frontPreview.style.backgroundImage = `url(${frontImage})`;
    frontPreview.style.backgroundSize = 'cover'; // Ensure the image fits the preview area
    frontPreview.style.backgroundPosition = 'center'; // Center the image
    frontPreview.textContent = ''; // Remove the text content
    frontPreview.style.border = "0px white"; // Remove the border
}
//handle section single image upload preview
function uploadSectionImage(event) {
    const fileInput = event.target; // The input element that triggered the event
    const sectionNumber = fileInput.id.split('_')[2]; // Extract the section number from the input ID
    const preview = document.getElementById(`section_image_preview_${sectionNumber}`); // Target the correct preview container

    if (fileInput.files && fileInput.files[0]) {
        const sectionImage = URL.createObjectURL(fileInput.files[0]);
        console.log(`Section Image URL for Section ${sectionNumber}:`, sectionImage);
        preview.style.backgroundImage = `url(${sectionImage})`;
        preview.style.backgroundSize = 'cover'; // Ensure the image fits the preview area
        preview.style.backgroundPosition = 'center'; // Center the image
        preview.textContent = ''; // Remove the text content
        preview.style.border = "0px white"; // Remove the border
    } else {
        console.error(`No file selected for Section ${sectionNumber}.`);
    }
}

//handle section multi image upload preview
function uploadAditionalImages(event) {
    const fileInput = event.target; // The input element that triggered the event
    const sectionNumber = fileInput.id.split('_')[2]; // Extract the section number from the input ID
    const previewContainer = document.getElementById(`additional_images_preview_${sectionNumber}`); // Target the correct preview container

    // Clear the preview container before adding new previews
    previewContainer.innerHTML = '';

    if (fileInput.files && fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    img.style.width = '100%'; // Thumbnail width
                    img.style.height = '100%'; // Thumbnail height
                    img.style.objectFit = 'cover'; // Ensure the image fits nicely
                    img.style.margin = '5px'; // Add spacing between thumbnails
                    img.style.border = '0.5px solid black'; // Add a border around the thumbnails
                    img.style.clipPath = 'none'; // Set clipPath to none
                    img.style.borderRadius = '5px'; // Add a border radius to the thumbnails
                    previewContainer.style.border = "0px white"; // Remove the border
                    previewContainer.style.display = 'grid';
                    previewContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px , 1fr)';
                    previewContainer.style.gridAutoRows = '100px';
                    previewContainer.style.gap = '10px';
                    previewContainer.style.gridAutoFlow = 'dense';
                    previewContainer.appendChild(img);
                                };
                reader.readAsDataURL(file);
            } else {
                console.warn(`File "${file.name}" is not an image and will be skipped.`);
            }
        });
    } else {
        console.error(`No files selected for Section ${sectionNumber}.`);
    }
}

// Add event listener to the initial section type dropdown
document.querySelector('.section-type').addEventListener('change', handleSectionTypeChange);

// add event listener to front page image input
frontFileInput.addEventListener('change', uploadFrontImage);

// Attach event listener to the existing section image inputs
existingImageInputs.forEach(input => {
    input.addEventListener('change', uploadSectionImage);
    
});

// Attach event listener to the existing section image inputs
addtionalImagesInput.forEach(input => {
    input.addEventListener('change', uploadAditionalImages);
    
});


document.querySelector('form').addEventListener('submit', function (event) {
    const maxFileSize = 2 * 1024 * 1024; // 2 MB in bytes

    // Validate front image
    const frontImageInput = document.getElementById('front_image');
    if (frontImageInput.files[0] && frontImageInput.files[0].size > maxFileSize) {
        alert('The front image exceeds the maximum allowed size of 2 MB.');
        event.preventDefault();
        return;
    }

    // Validate section images
    const sectionImageInputs = document.querySelectorAll('input[name="section_image[]"]');
    for (const input of sectionImageInputs) {
        if (input.files[0] && input.files[0].size > maxFileSize) {
            alert('One of the section images exceeds the maximum allowed size of 2 MB.');
            event.preventDefault();
            return;
        }
    }

    // Validate additional images
    const additionalImageInputs = document.querySelectorAll('input[name="additional_images[]"]');
    for (const input of additionalImageInputs) {
        for (const file of input.files) {
            if (file.size > maxFileSize) {
                alert('One of the additional images exceeds the maximum allowed size of 2 MB.');
                event.preventDefault();
                return;
            }
        }
    }

    // Prevent the default form submission
   // event.preventDefault();

    // Update all hidden inputs with Quill content
    quillInstances.forEach((quill, sectionNumber) => {
        const quillContent = quill.root.innerHTML; // Get the HTML content from Quill
        document.getElementById(`quill-content_${sectionNumber}`).value = quillContent; // Set it in the hidden input
    });

    // Debugging: Log the updated hidden inputs
    quillInstances.forEach((_, sectionNumber) => {
        console.log(`Hidden input for section ${sectionNumber}:`, document.getElementById(`quill-content_${sectionNumber}`).value);
    });

    // Programmatically submit the form after updating the inputs
    this.submit();
});

    