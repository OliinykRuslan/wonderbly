document.addEventListener('DOMContentLoaded', function() {
    const jsonFileName = 'form_data';
    let currentStep = 0;
    let maxSteps = 0;
    let doneSteps = 0;
    let currentTab = 0;
    let maxTabs = 0;
    let doneTabs = 0;
    let subtitles = [];
    let avatarPreview = document.querySelector('#avatar-preview');
    let isYPrefixAdded = false;

    function defaultInputGenerate(data) {
        let name = data['name'];
        let type = data['type'];
        let id = '';
        let placeholder = '';
        let inputHtml = '';
    
        if (data.hasOwnProperty('name')) {
            name = data['name'];
        }

        if (data.hasOwnProperty('id')) {
            id = data['id'];
        }
    
        if (data.hasOwnProperty('placeholder')) {
            placeholder = data['placeholder'];
        }
    
        inputHtml += '<div class="form-group">';
        if (data.hasOwnProperty('stepTitle')) {
            inputHtml += `<h4 class="step-field-title">${data['stepTitle']}</h4>`;
        }
    
        if (name && name !== '') {
            inputHtml += `<input type="${type}" id="${id}" name="${name}" placeholder="${placeholder}">`;
        }
    
        inputHtml += '</div>';
    
        return inputHtml;
    }

    function radioInputGenerate(data) {
        let name = data['name'];
        let type = data['type'];
        let mainLabel = '';
        let options = {};
        let inputHtml = '';

        if (data.hasOwnProperty('name')) {
            name = data['name'];
        }

        if (data.hasOwnProperty('label')) {
            mainLabel = data['label'];
        }

        if (data.hasOwnProperty('options')) {
            options = data['options'];
        } else {
            return;
        }

        inputHtml += '<div class="radiogroup">';

        for (let idx in options) {
            let option = options[idx];
            let value = option['value'];
            let label = option['label'];

            inputHtml += '<div class="radio-button">';
            inputHtml += `<input class="radio-item radio-input" type="${type}" id="${name}-${value}" name="${name}" value="${value}">`;

            if (label !== '') {
                inputHtml += `<label class="radio-label" for="${name}-${value}">${label}</label>`;
            }
            inputHtml += '</div>';
        }

        inputHtml += '</div>';

        return inputHtml;
    }

    function radioImageInputGenerate(data) {
        let name = '';
        let mainLabel = '';
        let options = {};
        let inputHtml = '';

        if (data.hasOwnProperty('name')) {
            name = data['name'];
        }

        if (data.hasOwnProperty('label')) {
            mainLabel = data['label'];
        }

        if (data.hasOwnProperty('options')) {
            options = data['options'];
        } else {
            return;
        }

        inputHtml += '<div class="character-wrap">';

        for (let idx in options) {
            let i = parseInt(idx) + 1;
            let option = options[idx];
            let value = option['value'];
            let image = option['image'];
            let label = option['label'];
            let gender = option['gender'];
            let dataGender = '';

            if (!image || image == '') {
                return;
            }

            if (gender && "" !== gender) {
                dataGender = `data-gender=${gender}`;
            }

            inputHtml += '<div class="character-item">';
            inputHtml += `<input class="radio-item choose-image-radio" id="${name}-${value}" type="radio" name="${name}" value="${value}" ${dataGender}>`;

            inputHtml += `<label class="choose-image-label" for="${name}-${value}">
                                <span class="img-wrap">
                                    <img alt="" src="${image}">
                                </span>
                            </label>`;
            inputHtml += '</div>';
        }

        inputHtml += '</div>';

        return inputHtml;
    }

    function createFields(fields) {
        let html = '';
        for (let indx in fields) {
            let fieldData = fields[indx];
            let type = fieldData['type'];

            switch (type) {
                case 'radio':
                    html += radioInputGenerate(fieldData);
                    break;
                case 'radio-image':
                    html += radioImageInputGenerate(fieldData);
                    break;
                default:
                    html += defaultInputGenerate(fieldData);
                    break;
            }
        }

        return html;
    }

    function createTabs(step) {
        let index = 0;
        let tabs = {};
        let navItems = '';
        let fieldsTabs = '';

        if (step.hasOwnProperty('stepNumber')) {
            index = step['stepNumber'];
        }

        if (step.hasOwnProperty('title') && subtitles.indexOf(step['title']) < 0) {
            subtitles.push(step['title']);
        }

        if (step.hasOwnProperty('tabs')) {
            tabs = step['tabs'];
        } else {
            console.warn('The step has no tabs (tabs).');
            return false;
        }

        if (!Array.isArray(tabs) || tabs.length == 0) {
            console.warn('tabs is empty or not an array.');
            return false;
        }

        maxTabs = tabs.length;

        for (let key in tabs) {
            let i = parseInt(key);
            let tab = tabs[key];
            let active = '';
            let label = '';

            if (!tab.hasOwnProperty('fields')) {
                console.warn(`The ${key} tab does not sweep fields.`);
                continue;
            }

            let fields = createFields(tab['fields']);

            if ('0' == key) {
                active = 'active';
            }

            if (tab.hasOwnProperty('name')) {
                label = tab['name'];
            }

            navItems += `<button type="button" class="tab-nav-item ${active}" data-tab="${key}">${label}</button>`;
            fieldsTabs += `<div class="step-item step-${i}">${fields}</div>`;
        }

        return {
            'navs': navItems,
            'fields': fieldsTabs,
        };
    }

    function createSteps(data) {
        let stepsObj = data['steps'];
        let stepsCount = stepsObj.length;
        let form = document.getElementById('steps_form');

        if (!form) {
            console.error('Елемент з id "steps_form" не знайдено в DOM.');
            return;
        }

        maxSteps = stepsCount;

        let selectors = {
            0: 'oldest-form',
            1: 'youngest-form',
        }

        for (let key in stepsObj) {
            let i = key;
            let stepHtml = '';
            let selector = `form-step-${key}`;

            if (selectors.hasOwnProperty(key)) {
                selector = selectors[key];

                if (key > 0) {
                    selector += ' d-none';
                }
            };

            let stepData = createTabs(stepsObj[i]);

            stepHtml = `<div class="form ${selector}"> 
                            <div class="tab-nav">${stepData['navs']}</div> 
                            <div class="step-fields">${stepData['fields']}</div> 
                            <div class="step-actions">
                                <button type="button" class="submit-btn" id="continue-btn-${i}">Continue</button> 
                                <a href="#" class="back-link"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="CreationFlowStep_backIcon__1WNIb"><path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clip-rule="evenodd"></path>
                                    </svg>
                                    Back to the product page
                                </a>
                            </div>
                        </div>`;

            form.insertAdjacentHTML('beforeend', stepHtml);
        }
    }

    function loadFormData() {
        fetch(`assets/json/${jsonFileName}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const headerTitleElement = document.querySelector('.header-title');
                if (headerTitleElement && data.bookTitle) {
                    headerTitleElement.textContent = data.bookTitle;
                }

                createSteps(data);
                showStep();

                document.querySelectorAll('#steps_form input[type="radio"]').forEach(function(radio) {
                    radio.addEventListener('change', function() {
                        const wrapper = this.closest('.radiogroup, .character-wrap');
                        const errorMessage = wrapper.querySelector('.error-message');
    
                        if (wrapper.classList.contains('error')) {
                            wrapper.classList.remove('error');
                            if (errorMessage) {
                                errorMessage.remove();
                            }
                        }
                    });
                });

                document.querySelectorAll('#steps_form input[type="text"]').forEach(function(input) {
                    input.addEventListener('blur', function() {
                        const isError = validateTextInput(this);

                        if (!isError) {
                            const wrapper = this.closest('.form-group');
                            const errorMessage = wrapper.querySelector('.error-message');
                            this.classList.remove('error');
                            if (errorMessage) {
                                errorMessage.remove();
                            }
                        }
                    });
                });

                document.querySelectorAll('#steps_form input[type="radio"]').forEach(function(input, i) {
                    input.addEventListener('change', function() {
                        let yPrefix = isYPrefixAdded ? 'y-' : '';
                        if (`${yPrefix}gender` === this.getAttribute('name')) {
                            let mainGender = this.value;

                            let characters = document.querySelectorAll(`#steps_form .step-fields .step-item [name="${yPrefix}characters"]`);
                            characters.forEach(function(character, indx) {
                                if (character.dataset.gender === mainGender) {
                                    let characterItem = character.closest('.character-item');
                                    characterItem.style.display = 'block';
                                } else {
                                    let characterItem = character.closest('.character-item');
                                    characterItem.style.display = 'none';
                                };
                            });
                            updateAvatarBasedOnGender(this.value);
                        } else if (`${yPrefix}characters` === this.getAttribute('name')) {
                            let gender = this.dataset.gender;
                            console.log(`${yPrefix}characters:: ${gender}`);
                            let label = document.querySelector(`label[for="${this.id}"]`);
                            let img = label.querySelector('img');
                            let src = img.getAttribute('src');
                            updateAvatarBasedOnGender(gender, src);
                        }
                    });
                });

                document.querySelectorAll('.step-actions .submit-btn').forEach(function(btn) {
                    btn.addEventListener('click', function(event) {
                        event.preventDefault();

                        setTimeout(() => {
                            let activeInputs = this.closest('.form').querySelectorAll(`.step-${currentTab} input`);
                            let isValid = defaultValidateFields(activeInputs);

                            if (isValid) {
                                ++currentTab;
                                ++doneTabs;
                                // Tabs
                                if (currentTab < maxTabs) {
                                    showStep();
                                } else {
                                    // Steps
                                    ++doneSteps;
                                    if (currentStep + 1 < maxSteps) {
                                        ++currentStep;
                                        currentTab = 0;
                                        isYPrefixAdded = true;
                                        doneTabs = 0;
                                        updateAvatarBasedOnGender('boy');
                                        showStep();
                                    } else {
                                        // Finished
                                        window.location.href = './preview.html';
                                    }
                                }
                            } else {
                                return false;
                            }
                        }, 100);
                    });
                });

            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
            });
    }

    loadFormData();

    function showStep() {
        let index = currentTab;

        document.querySelector('.step-title .step-number').textContent = currentStep + 1;
        document.querySelector('.step-title .step-count').textContent = maxSteps;
        document.querySelector('.step-wrap .step-subtitle').textContent = subtitles[currentStep];

        let tabsSteps = document.querySelectorAll('.form');

        tabsSteps.forEach(function(el, idx) {
            let navs = el.querySelectorAll('.tab-nav-item');
            let stepFields = el.querySelectorAll('.step-fields .step-item');

            if (idx == currentStep) {
                el.style.display = 'flex';
                el.classList.remove('d-none');

                navs.forEach(function(nav, navInx) {
                    if (navInx == index) {
                        nav.classList.add('active');
                        nav.classList.add('done');
                    } else {
                        nav.classList.remove('active');
                    }
                });

                stepFields.forEach(function(step, stepInx) {
                    if (step.classList.contains(`step-${index}`)) {
                        step.style.display = 'block';
                    } else {
                        step.style.display = 'none';
                    }
                });
            } else {
                el.style.display = 'none';
                el.classList.add('d-none');

                navs.forEach(function(nav, navInx) {
                    nav.classList.remove('active');
                });
            }
        });
    }

    function updateAvatarBasedOnGender(gender, src = '') {
        let previweContainer = document.querySelector('.avatar-preview-container');
        console.log("Gender:: " + gender);
        if ('' === src) {
            let prefix = isYPrefixAdded ? 'y-' : '';
            src = `assets/img/${gender === 'boy' ? `${prefix}avatar-04.png` : `g-${prefix}avatar-04.png`}`;
            previweContainer.classList.remove('active');
        } else {
            previweContainer.classList.add('active');
        }

        avatarPreview.setAttribute('src', src);
    }

    document.addEventListener('click', function(event) {
        if (event.target.matches('.tab-nav-item')) {
            currentTab = parseInt(event.target.dataset.tab);

            if (currentTab > doneTabs) {
                return;
            }

            showStep();
        }
    });

    function validateRadioInputs(inputs) {
        const errorText = "Oops! Don't forget to fill this in.";
        const errors = [];

        inputs.forEach(function(input, idx) {
            const type = input.getAttribute('type');
            const name = input.getAttribute('name');
            const errorCheck = errors.indexOf(name);

            if (type === 'radio') {
                const wrapper = input.closest('.radiogroup, .character-wrap');
                const checkedLength = wrapper.querySelectorAll('input:checked').length;
                const errorMessage = wrapper.querySelector('.error-message');

                if (checkedLength > 0) {
                    wrapper.classList.remove('error');
                    if (errorMessage) {
                        errorMessage.remove();
                    }
                    if (errorCheck > -1) {
                        errors.splice(errorCheck, 1);
                    }
                } else {
                    wrapper.classList.add('error');
                    if (!errorMessage) {
                        wrapper.insertAdjacentHTML('beforeend', `<span class="error-message">${errorText}</span>`);
                    }
                    if (errorCheck === -1) {
                        errors.push(name);
                    }
                }
            }
        });
        return errors;
    }

    function validateTextInput(input) {
        const errorText = "Oops! Don't forget to fill this in.";
        const invalidCharsError = "Whoops! This contains unsupported characters. Try again.";
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
        const name = input.getAttribute('name');
        const wrapper = input.closest('.form-group');
        let errorMessage = wrapper.querySelector('.error-message');
        const value = input.value.trim();
        let hasError = false;
        if (value.length === 0) {
            hasError = true;
            input.classList.add('error');
            if (!errorMessage) {
                wrapper.insertAdjacentHTML('beforeend', `<span class="error-message">${errorText}</span>`);
            } else {
                errorMessage.textContent = errorText;
            }
        } else {
            if (name === 'child-name' || name === 'youngest-child-name') {
                if (!nameRegex.test(value)) {
                    hasError = true;
                    input.classList.add('error');
                    if (!errorMessage) {
                        wrapper.insertAdjacentHTML('beforeend', `<span class="error-message">${invalidCharsError}</span>`);
                    } else {
                        errorMessage.textContent = invalidCharsError;
                    }
                }
            }
        }
        if (!hasError) {
            input.classList.remove('error');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
        return hasError;
    }

    function defaultValidateFields(inputs) {
        const radioErrors = validateRadioInputs(inputs);
        const textErrors = [];

        inputs.forEach(function(input, idx) {
            const type = input.getAttribute('type');
            if (type === 'text') {
                if (validateTextInput(input)) {
                    textErrors.push(input.getAttribute('name'));
                }
            }
        });

        return radioErrors.concat(textErrors).length === 0;
    }

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

    // Modal
    const modalButtons = document.querySelectorAll('.modal-btn');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.getElementById('modal-close');

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
});