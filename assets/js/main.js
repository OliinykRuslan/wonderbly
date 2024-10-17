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

    let currentStep = 0;    
    let currentStep2 = 0;

    let maxStep = 0;
    let maxStep2 = 0;

    let isYPrefixAdded = false;

    // Function for validating the Name input
    function validateName() {
        const nameValue = nameInput.value.trim();
        const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄє]+$/;

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
        const youngestNameRegex = /^[A-Za-zА-Яа-яІіЇїЄє]+$/;

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

    // Event for character change (oldest)
    characterRadios.forEach(radio => {
        radio.addEventListener('change', updateAvatarBasedOnCharacter);
    });

    // Event for character change (youngest)
    characterRadios2.forEach(radio => {
        radio.addEventListener('change', updateAvatarBasedOnCharacter2);
    });

    // Event for "Continue" button (oldest)
    continueButton.addEventListener('click', function(event) {
        event.preventDefault();

        // Validation review
        if (!validateName()) {
            return;
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

            isYPrefixAdded = true;

            // Set the avatar of a young child for dressing up when moving to the first generation
            const defaultGender = document.querySelector('.youngest-form .radio-input:checked')?.value || 'boy';
            updateAvatarBasedOnGender2(defaultGender);

            showStep2(0);
        }
    });

    // Event for "Continue" button (youngest)
    continueButton2.addEventListener('click', function(event) {
        event.preventDefault();

        // Validation review
        if (!validateYoungestName()) {
            return;
        }

        if (currentStep2 < steps2.length - 1) {
            currentStep2++;
            maxStep2 = Math.max(currentStep2, maxStep2);
            showStep2(currentStep2);
        } else {
            window.location.href = '/preview';
        }
    });

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