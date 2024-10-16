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

    let currentStep = 0;    
    let currentStep2 = 0;

    let maxStep = 0;
    let maxStep2 = 0;

    let isYPrefixAdded = false;

    // Show step
    function showStep(index) {
        steps.forEach((step, idx) => step.style.display = idx === index ? 'block' : 'none');
        tabNavButtons.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === index);
            if (idx <= maxStep) btn.classList.add('done');
        });
    }

    // Show step2
    function showStep2(index) {
        steps2.forEach((step, idx) => step.style.display = idx === index ? 'block' : 'none');
        tabNavButtons2.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === index);
            if (idx <= maxStep2) btn.classList.add('done');
        });
    }

    // Update avatar based on gender selection
    function updateAvatarBasedOnGender(gender) {
        const prefix = isYPrefixAdded ? 'y-' : '';
        avatarPreview.src = `assets/img/${prefix}${gender === 'boy' ? 'avatar-04.png' : 'g-avatar-04.png'}`;
    }

    // Update avatar based on character selection
    function updateAvatarBasedOnCharacter() {
        const selectedCharacter = document.querySelector('.oldest-form .choose-image-radio:checked + label img').src;
        avatarPreview.src = selectedCharacter;
    }

    // Event for gender change
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

    // Event for character change
    characterRadios.forEach(radio => {
        radio.addEventListener('change', updateAvatarBasedOnCharacter);
    });

    // Event for "Continue" button
    continueButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (currentStep < steps.length - 1) {
            currentStep++;
            maxStep = Math.max(currentStep, maxStep);
            showStep(currentStep);
        } else if (!isYPrefixAdded) {
            const currentSrc = avatarPreview.src;
            avatarPreview.src = currentSrc.replace(currentSrc.split('/').pop(), `y-${currentSrc.split('/').pop()}`);
            isYPrefixAdded = true;
            document.querySelector('.step-number').innerText = "2";
            document.querySelector('.step-subtitle').innerText = "Splendid! Who's the youngest child?";
            
            document.querySelector('.oldest-form').classList.add('d-none');
            document.querySelector('.youngest-form').classList.remove('d-none');

            showStep(0);
        }
    });

    // Initialize the first step
    showStep(0);

    // Update avatar based on gender selection (youngest form)
    function updateAvatarBasedOnGender2(gender) {
        avatarPreview.src = `assets/img/${gender === 'boy' ? 'y-avatar-04.png' : 'g-y-avatar-04.png'}`;
    }

    // Update avatar based on character selection (youngest form)
    function updateAvatarBasedOnCharacter2() {
        const selectedCharacter = document.querySelector('.youngest-form .choose-image-radio:checked + label img').src;
        avatarPreview.src =  selectedCharacter;
    }

    // Event for gender change (youngest form)
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

    // Event for character change (youngest form)
    characterRadios2.forEach(radio => {
        radio.addEventListener('change', updateAvatarBasedOnCharacter2);
    });

    continueButton2.addEventListener('click', function(event) {
        event.preventDefault();
        if (currentStep2 < steps.length - 1) {
            currentStep2++;
            maxStep2 = Math.max(currentStep2, maxStep2);
            showStep2(currentStep2);
        }
        else if (!isYPrefixAdded) {
            const currentSrc = avatarPreview.src;
            avatarPreview.src = currentSrc.replace(currentSrc.split('/').pop(), `y-${currentSrc.split('/').pop()}`);
            isYPrefixAdded = true;
            showStep2(0);
        } else  {
            window.location.href = '/preview';
        }
    });

    // Initialize the first step (youngest form)
    showStep2(0);

    // Event for navigation buttons
    tabNavButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (index <= maxStep) {
                currentStep = index;
                showStep(currentStep);
            }
        });
    });

    tabNavButtons2.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (index <= maxStep2) {
                currentStep2 = index;
                showStep2(currentStep2);
            }
        });
    });

});