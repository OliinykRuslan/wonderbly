document.addEventListener('DOMContentLoaded', function() {
    const avatarPreview = document.getElementById('avatar-preview');

    const genderRadios = document.querySelectorAll('.oldest-form .radio-input');    
    const genderRadios2 = document.querySelectorAll('.youngest-form .radio-input');

    const characterRadios = document.querySelectorAll('.oldest-form .choose-image-radio');    
    const characterRadios2 = document.querySelectorAll('.youngest-form .choose-image-radio');

    const steps = document.querySelectorAll('.oldest-form .step-fields > div, .oldest-form .step-item');    
    const steps2 = document.querySelectorAll('.youngest-form .step-fields > div, .youngest-form .step-item');

    const tabNavButtons = document.querySelectorAll('.oldest-form .tab-nav-item');
    const tabNavButtons2 = document.querySelectorAll('.youngest-form .tab-nav-item');

    const continueButton = document.querySelector('.oldest-form .submit-btn');
    const continueButton2 = document.querySelector('.youngest-form .submit-btn');

    const characterImages = document.querySelectorAll('.oldest-form .character-wrap img');    
    const characterImages2 = document.querySelectorAll('.youngest-form .character-wrap img');

    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');

    const youngestNameInput = document.getElementById('youngest-name');
    const youngestNameError = document.getElementById('youngest-name-error');

    const genderError = document.createElement('span');    
    const characterError = document.createElement('span');
    const ageError = document.createElement('span');

    const radioGroup = document.querySelector('.oldest-form .step-1 .radiogroup');    
    const characterRadioGroup = document.querySelector('.oldest-form .step-2');
    const ageRadioGroup = document.querySelector('.oldest-form .step-3 .radiogroup');

    const characterErrorYoungest = document.createElement('span');
    const ageErrorYoungest = document.createElement('span');

    const characterRadioGroupYoungest = document.querySelector('.youngest-form .step-2');
    const ageRadioGroupYoungest = document.querySelector('.youngest-form .step-3-youngest .age-wrap');
    if (radioGroup) {
        genderError.classList.add('error-message');
        radioGroup.appendChild(genderError);
    }

    if (characterRadioGroup) {
        characterError.classList.add('error-message');
        characterRadioGroup.appendChild(characterError);
    }

    if (ageRadioGroup) {
        ageError.classList.add('error-message');
        ageRadioGroup.appendChild(ageError);
    }

    const youngestGenderError = document.createElement('span');
    const youngestRadioGroup = document.querySelector('.youngest-form .radiogroup');
    if (youngestRadioGroup) { 
        youngestGenderError.classList.add('error-message');
        youngestRadioGroup.appendChild(youngestGenderError);
    }

    if (characterRadioGroupYoungest) {
        characterErrorYoungest.classList.add('error-message');
        characterRadioGroupYoungest.appendChild(characterErrorYoungest);
    }

    if (ageRadioGroupYoungest) {
        ageErrorYoungest.classList.add('error-message');
        ageRadioGroupYoungest.appendChild(ageErrorYoungest);
    }

    let currentStep = 0;    
    let currentStep2 = 0;

    let maxStep = 0;
    let maxStep2 = 0;

    let isYPrefixAdded = false;

    // Function for validating the Name input
    function validateName() {
        const nameValue = nameInput.value.trim();
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameValue) {
            nameError.textContent = "Oops! Don't forget to fill this in";
            nameInput.classList.add('error');
            return false;
        } else if (!nameRegex.test(nameValue)) {
            nameError.textContent = "Whoops! This contains unsupported characters. Try again.";
            nameInput.classList.add('error');
            return false;
        } else {
            nameError.textContent = '';
            nameInput.classList.remove('error');
            return true;
        }
    }

    // Function for validating Youngest Name input
    function validateYoungestName() {
        const youngestNameValue = youngestNameInput.value.trim();
        const youngestNameRegex = /^[A-Za-z]+$/;
        if (!youngestNameValue) {
            youngestNameError.textContent = "Oops! Don't forget to fill this in";
            youngestNameInput.classList.add('error');
            return false;
        } else if (!youngestNameRegex.test(youngestNameValue)) {
            youngestNameError.textContent = "Whoops! This contains unsupported characters. Try again.";
            youngestNameInput.classList.add('error');
            return false;
        } else {
            youngestNameError.textContent = '';
            youngestNameInput.classList.remove('error');
            return true;
        }
    }

    // Function for validating Gender radio buttons for older children
    function validateGender() {
        const selectedGender = document.querySelector('.oldest-form .radio-input:checked');
        const radiogroup = document.querySelector('.oldest-form .step-1 .radiogroup');
        if (!selectedGender) {
            genderError.textContent = "Oops! Don't forget to fill this in.";
            radiogroup.classList.add('error'); // The 'error' class is added if the radio button is not selected
            return false;
        } else {
            genderError.textContent = ''; // Clear the box when the radio is turned on
            radiogroup.classList.remove('error'); // The 'error' class is removed if the radio button is selected
            return true;
        }
    }

    // Function for validating Gender radio buttons for young children
    function validateYoungestGender() {
        const selectedGender = document.querySelector('.youngest-form .radio-input:checked');
        const radiogroup = document.querySelector('.youngest-form .radiogroup');
        if (!selectedGender) {
            youngestGenderError.textContent = "Oops! Don't forget to fill this in.";
            radiogroup.classList.add('error'); // The 'error' class is added if the radio button is not selected
            return false;
        } else {
            youngestGenderError.textContent = ''; // Clear the box when the radio is turned on
            radiogroup.classList.remove('error'); // The 'error' class is removed if the radio button is selected
            return true;
        }
    }

    // Validation on blur for the name of the oldest child
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateName();
        });
    }

    // Validation on blur for the name of a young child
    if (youngestNameInput) {
        youngestNameInput.addEventListener('blur', function() {
            validateYoungestName();
        });
    }

    // Validation on change for radio buttons of the oldest child
    genderRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            validateGender();
        });
    });

    // Validation on change for radio buttons of young children
    genderRadios2.forEach(radio => {
        radio.addEventListener('change', function() {
            validateYoungestGender();
        });
    });

    // Show step for oldest
    function showStep(index) {
        steps.forEach((step, idx) => step.style.display = idx === index ? 'block' : 'none');
        tabNavButtons.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === index);
            if (idx <= maxStep) btn.classList.add('done');
        });
    }

    // Show step for youngest
    function showStep2(index) {
        steps2.forEach((step, idx) => step.style.display = idx === index ? 'block' : 'none');
        tabNavButtons2.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === index);
            if (idx <= maxStep2) btn.classList.add('done');
        });
    }

    // Update avatar based on gender selection for oldest
    function updateAvatarBasedOnGender(gender) {
        const prefix = isYPrefixAdded ? 'y-' : '';
        avatarPreview.src = `assets/img/${prefix}${gender === 'boy' ? 'avatar-04.png' : 'g-avatar-04.png'}`;
    }

    // Update avatar based on gender selection for youngest
    function updateAvatarBasedOnGender2(gender) {
        avatarPreview.src = `assets/img/${gender === 'boy' ? 'y-avatar-04.png' : 'g-y-avatar-04.png'}`;
    }

    // Update avatar based on character selection for oldest
    function updateAvatarBasedOnCharacter() {
        const selectedCharacter = document.querySelector('.oldest-form .choose-image-radio:checked + label img').src;
        avatarPreview.src = selectedCharacter;
    }

    // Update avatar based on character selection for youngest
    function updateAvatarBasedOnCharacter2() {
        const selectedCharacter = document.querySelector('.youngest-form .choose-image-radio:checked + label img').src;
        avatarPreview.src = selectedCharacter;
    }

    // Event for gender change (oldest)
    genderRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateAvatarBasedOnGender(this.value);
            characterImages.forEach(img => {
                const fileName = img.src.split('/').pop();
                img.src = this.value === 'girl' && !fileName.startsWith('g-') ? img.src.replace(fileName, `g-${fileName}`) :
                          this.value === 'boy' && fileName.startsWith('g-') ? img.src.replace('g-', '') : img.src;
            });
        });
    });

    // Event for gender change (youngest)
    genderRadios2.forEach(radio => {
        radio.addEventListener('change', function() {
            updateAvatarBasedOnGender2(this.value);
            characterImages2.forEach(img => {
                const fileName = img.src.split('/').pop();
                img.src = this.value === 'girl' && !fileName.startsWith('g-') ? img.src.replace(fileName, `g-${fileName}`) :
                          this.value === 'boy' && fileName.startsWith('g-') ? img.src.replace('g-', '') : img.src;
            });
        });
    });

    function toggleAvatarActiveClassOldest() {
        const selectedCharacterOldest = document.querySelector('.oldest-form .choose-image-radio:checked');
        const avatarPreviewContainer = document.querySelector('.avatar-preview-container');
        if (selectedCharacterOldest) {
            avatarPreviewContainer.classList.add('active');
        } else {
            avatarPreviewContainer.classList.remove('active');
        }
    }
    function toggleAvatarActiveClassYoungest() {
        const selectedCharacterYoungest = document.querySelector('.youngest-form .choose-image-radio:checked');
        const avatarPreviewContainer = document.querySelector('.avatar-preview-container');
        if (selectedCharacterYoungest) {
            avatarPreviewContainer.classList.add('active');
        } else {
            avatarPreviewContainer.classList.remove('active');
        }
    }

    // Event for character change (oldest)
    characterRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateAvatarBasedOnCharacter();
            toggleAvatarActiveClassOldest();
        });
    });

    // Validation changing the character (second step for the oldest child)
    characterRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            validateCharacterSelectionOldest();
        });
    });

    // Function character validation (oldest child)
    function validateCharacterSelectionOldest() {
        const characterRadioGroup = document.querySelector('.oldest-form .step-2');
        characterError.textContent = '';
        characterRadioGroup.classList.remove('error');
        return true;
    }

    // Validation changing the age (third step for the oldest child)
    document.querySelectorAll('.oldest-form .radio-age').forEach(radio => {
        radio.addEventListener('change', function() {
            validateAgeSelectionOldest();
        });
    });

    // Function age validation (oldest child)
    function validateAgeSelectionOldest() {
        const ageRadioGroup = document.querySelector('.oldest-form .step-3 .radiogroup');
        ageError.textContent = '';
        ageRadioGroup.classList.remove('error');
        return true;
    }

    // Validation changing the character (second step for the youngest child)
    characterRadios2.forEach(radio => {
        radio.addEventListener('change', function() {
            validateCharacterSelectionYoungest();
        });
    });

    // Function character validation (youngest child)
    function validateCharacterSelectionYoungest() {
        const characterRadioGroup = document.querySelector('.youngest-form .step-2');
        characterErrorYoungest.textContent = '';
        characterRadioGroup.classList.remove('error');
        return true;
    }

    // Validation changing the age (third step for the youngest child)
    document.querySelectorAll('.youngest-form .radio-age-youngest').forEach(radio => {
        radio.addEventListener('change', function() {
            validateAgeSelectionYoungest();
        });
    });

    // Function for age validation (youngest child)
    function validateAgeSelectionYoungest() {
        const ageRadioGroupYoungest = document.querySelector('.youngest-form .step-3-youngest .radiogroup');
        ageErrorYoungest.textContent = '';
        ageRadioGroupYoungest.classList.remove('error');
        return true;
    }

    // Event for character change (youngest)
    characterRadios2.forEach(radio => {
        radio.addEventListener('change', function() {
            updateAvatarBasedOnCharacter2();
            toggleAvatarActiveClassYoungest();
        });
    });

    // Event for "Continue" button (oldest)
    if (continueButton) {
        continueButton.addEventListener('click', function(event) {
            event.preventDefault();
            // Validation review
            const isNameValid = validateName();
            const isGenderValid = validateGender();

            if (!isNameValid || !isGenderValid) {
                return;
            }

            if (currentStep === 1) { 
                const selectedCharacter = document.querySelector('.oldest-form .choose-image-radio:checked');
                const characterRadioGroup = document.querySelector('.oldest-form .step-2');
                if (!selectedCharacter) {
                    characterError.textContent = "Oops! Don't forget to fill this in.";
                    characterRadioGroup.classList.add('error');
                    return false;
                } else {
                    characterError.textContent = '';
                    characterRadioGroup.classList.remove('error');
                }
            }

            if (currentStep === 2) {
                const selectedAge = document.querySelector('.oldest-form .radio-age:checked');
                const ageRadioGroup = document.querySelector('.oldest-form .step-3 .radiogroup');
                if (!selectedAge) {
                    ageError.textContent = "Oops! Don't forget to fill this in.";
                    ageRadioGroup.classList.add('error');
                    return false;
                } else {
                    ageError.textContent = '';
                    ageRadioGroup.classList.remove('error');
                }
            }

            if (currentStep < steps.length - 1) {
                currentStep++;
                maxStep = Math.max(currentStep, maxStep);
                showStep(currentStep);
            } else if (!isYPrefixAdded) {
                document.querySelector('.step-number').innerText = "2";
                document.querySelector('.step-subtitle').innerText = "Splendid! Who's the youngest child?";
                document.querySelector('.oldest-form').classList.add('d-none');
                document.querySelector('.youngest-form').classList.remove('d-none');

                // Remove the "active" class from the avatar container for young children
                const avatarPreviewContainer = document.querySelector('.avatar-preview-container');
                avatarPreviewContainer.classList.remove('active');
                isYPrefixAdded = true;

                // Set the avatar of a young child for dressing up when moving to the first generation
                const defaultGender = document.querySelector('.youngest-form .radio-input:checked')?.value || 'boy';
                updateAvatarBasedOnGender2(defaultGender);

                showStep2(0);
            }
        });
    }

    // Event for "Continue" button (youngest)
    if (continueButton2) {
        continueButton2.addEventListener('click', function(event) {
            event.preventDefault();
            // Validation review
            const isYoungestNameValid = validateYoungestName();
            const isYoungestGenderValid = validateYoungestGender();
            if (!isYoungestNameValid || !isYoungestGenderValid) {
                return;
            }
            if (currentStep2 === 1) { 
                const selectedCharacter = document.querySelector('.youngest-form .choose-image-radio:checked');
                const characterRadioGroup = document.querySelector('.youngest-form .step-2');
                if (!selectedCharacter) {
                    characterErrorYoungest.textContent = "Oops! Don't forget to fill this in.";
                    characterRadioGroup.classList.add('error');
                    return false;
                } else {
                    characterErrorYoungest.textContent = '';
                    characterRadioGroup.classList.remove('error');
                }
            }

            if (currentStep2 === 2) {
                const selectedAge = document.querySelector('.youngest-form .radio-age-youngest:checked');
                const ageRadioGroupYoungest = document.querySelector('.youngest-form .step-3-youngest .radiogroup');
                if (!selectedAge) {
                    ageErrorYoungest.textContent = "Oops! Don't forget to fill this in.";
                    ageRadioGroupYoungest.classList.add('error');
                    return false;
                } else {
                    ageErrorYoungest.textContent = '';
                    ageRadioGroupYoungest.classList.remove('error');
                    window.location.href = './preview.html';
                }
            }
            if (currentStep2 < steps2.length - 1) {
                currentStep2++;
                maxStep2 = Math.max(currentStep2, maxStep2);
                showStep2(currentStep2);
            } else {
                window.location.href = './preview.html';
            }
        });
    }

    // Initialize the first steps
    showStep(0);
    showStep2(0);

    // Navigation buttons for oldest
    tabNavButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (index <= maxStep) {
                currentStep = index;
                showStep(currentStep);
            }
        });
    });

    // Navigation buttons for youngest
    tabNavButtons2.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (index <= maxStep2) {
                currentStep2 = index;
                showStep2(currentStep2);
            }
        });
    });
});

// page preview **
const layoutButtons = document.querySelectorAll('.layout-button');
const pageContainers = document.querySelectorAll('.page-container');
const previewContainer = document.querySelector('.preview-container');

// Function controls the switching of active classes
layoutButtons.forEach(button => {
  button.addEventListener('click', function() {
    layoutButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    if (this.classList.contains('one-page')) {
      pageContainers.forEach(container => container.classList.remove('two-page'));
      previewContainer.classList.remove('preview-two-page');
    } else if (this.classList.contains('two-page')) {
      pageContainers.forEach(container => container.classList.add('two-page'));
      previewContainer.classList.add('preview-two-page');
    }
  });
});

// modal
const modalButtons = document.querySelectorAll('.modal-btn');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('modal-close');

// const element = document.querySelector('#elementId');
if (modal) {
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
          modal.style.display = 'flex';
        });
      });
      closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
      });
      window.addEventListener('click', function(event) {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
    });
}

