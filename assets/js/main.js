jQuery( document ).ready( function( $ ) {
    let currentStep    = 0;
    let maxSteps       = 0;
    let doneSteps      = 0;
    let currentTab     = 0;
    let maxTabs        = 0;
    let doneTabs       = 0;
    let subtitles      = [];
    let avatarPreview  = $( document ).find( '#avatar-preview' );
    let isYPrefixAdded = false;

    function defaultInputGenerate( data ) {
        let name            = data['name'];
        let type            = data['type'];
        let id              = '';
        let placeholder     = '';
        let inputHtml       = '';

        if ( data.hasOwnProperty( 'name' ) ) {
            name =  data['name'];
        }

        if ( data.hasOwnProperty( 'id' ) ) {
            idVal = `id="${id}"`;
        }

        if ( data.hasOwnProperty( 'placeholder' ) ) {
            placeholder =  data['placeholder'];
        }

        inputHtml += '<div class="form-group">';
        if ( data.hasOwnProperty( 'stepTitle' ) ) {
            inputHtml += `<h4 class="step-field-title">${ data['stepTitle'] }</h4>`;
        }

        if ( name && name !== '' ) {
            inputHtml += `<input type="${ type }" id="${ id} " name="${ name }" placeholder="${ placeholder }">`;
        }

        inputHtml += '</div>';

        return inputHtml;
    }

    function radioInputGenerate( data ) {
        let name            = data['name'];
        let type            = data['type'];
        let mainLabel       = '';
        let options         = {};
        let inputHtml       = '';

        if ( data.hasOwnProperty( 'name' ) ) {
            name =  data['name'];
        }

        if ( data.hasOwnProperty( 'label' ) ) {
            mainLabel =  data['label'];
        }

        if ( data.hasOwnProperty( 'options' ) ) {
            options =  data['options'];
        } else {
            return;
        }

        inputHtml += '<div class="radiogroup">';

        for ( idx in options ) {
            let option = options[idx];
            let value  = option['value'];
            let label  = option['label'];
            
            inputHtml += '<div class="radio-button">';
            inputHtml += `<input class="radio-item radio-input" type="${ type }" id="${name}-${ value }" name="${ name }" value="${ value }">`;

            if ( label !== '' ) {
                inputHtml += `<label class="radio-label" for="${name}-${ value }">${ label }</label>`;
            }
            inputHtml += '</div>';
        } ;

        inputHtml += '</div>';

        return inputHtml;
    }

    function radioImageInputGenerate( data ) {
        let name            = '';
        let mainLabel       = '';
        let options         = {};
        let inputHtml       = '';

        if ( data.hasOwnProperty( 'name' ) ) {
            name =  data['name'];
        }

        if ( data.hasOwnProperty( 'label' ) ) {
            mainLabel =  data['label'];
        }

        if ( data.hasOwnProperty( 'options' ) ) {
            options =  data['options'];
        } else {
            return;
        }

        inputHtml += '<div class="character-wrap">';

        for ( idx in options ) {
            let i           = parseInt( idx ) + 1;
            let option      = options[idx];
            let value       = option['value'];
            let image       = option['image'];
            let label       = option['label'];
            let gender      = option['gender'];
            let dataGender  = '';

            if ( !image || image == '' ) {
                return;
            }

            if ( gender && "" !== gender ) {
                dataGender = `data-gender=${ gender }`;
            }
            
            inputHtml += '<div class="character-item">';
                inputHtml += `<input class="radio-item choose-image-radio" id="${name}-${ value }" type="radio" name="${ name }" value="${ value }" ${ dataGender }>`;
            
                inputHtml += `<label class="choose-image-label" for="${name}-${ value }">
                                <span class="img-wrap">
                                    <img alt="" src="${ image }">
                                </span>
                            </label>`;
            inputHtml += '</div>';
        };

        inputHtml += '</div>';

        return inputHtml;
    }

    function createFields( fields ){
        let html = '';
        for( indx in fields ) {
            let fieldData       = fields[indx];
            let type            = fieldData['type'];

            switch( type ) {
                case 'radio':
                    html +=  radioInputGenerate( fieldData );
                    break;
                case 'radio-image':
                    html +=  radioImageInputGenerate( fieldData );
                    break;
                default:
                    html +=  defaultInputGenerate( fieldData );
                    break;
            }
        }

        return html;
    }
    
    function createTabs( step ) {
        let index        = 0;
        let tabs         = {};
        let navItems     = '';
        let fieldsTabs   = '';
    
        if ( step.hasOwnProperty( 'stepNumber' ) ) {
            index  = step['stepNumber'];
        }
    
        if ( step.hasOwnProperty( 'title' ) && subtitles.indexOf( step['title'] ) < 0 ) {
            subtitles.push( step['title'] );
        }
    
        if ( step.hasOwnProperty( 'tabs' ) ) {
            tabs = step['tabs'];
        }

        if ( tabs.length == 0 ) {
            return false;
        }

        maxTabs = tabs.length;
    
        for( key in tabs ) {
            let i        = parseInt( key );
            let tab      = tabs[key];
            let active   = '';
            let label    = '';
            let fields   = createFields( tab['fields'] );
    
            if ( '0' == key ) {
                active = 'active';
            }        
    
            if ( tab.hasOwnProperty( 'name' ) ) {
                label  = tab['name'];
            }
    
            navItems += `<button type="button" class="tab-nav-item ${ active }" data-tab="${ key }">${ label }</button>`;
            fieldsTabs += `<div class="step-item step-${ i }">${ fields }</div>`;
        }
    
        return { 
            'navs': navItems,
            'fields': fieldsTabs,
         };
    }
    
    function createSteps( data ) {
        let stepsObj   = data['steps'];
        let stepsCount = stepsObj.length;
        let form       = $( '#steps_form' );

        maxSteps = stepsCount;
    
        let selectors = {
            0: 'oldest-form',
            1: 'youngest-form',
        }
    
        for( key in stepsObj ) {
            let i = key;
            let stepHtml = '';
            let selector = `form-step-${ key }`;
    
            if( selectors.hasOwnProperty( key ) ) {
                selector = selectors[key];
        
                if( key > 0 ) {
                    selector += ' d-none'; 
                }
            };
            
            let stepData = createTabs( stepsObj[i] );
    
            stepHtml = `<div class="form ${ selector }"> \n
                            <div class="tab-nav">${ stepData['navs'] }</div> \n
                            <div class="step-fields">${ stepData['fields'] }</div> \n
                            <div class="step-actions"> \n
                                <button type="submit" class="submit-btn" id="continue-btn-${ i }">Continue</button> \n
                                <a href="#" class="back-link"> \n
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="CreationFlowStep_backIcon__1WNIb"><path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clip-rule="evenodd"></path> \n
                                    </svg> \n
                                    Back to the product page \n
                                </a> \n
                            </div> \n
                        </div> \n`;

            form.append( stepHtml );            
        }
    }
    
    function loadFormData() {
        fetch( 'assets/json/form_data.json' )
        .then( response => {
            if ( !response.ok ) {
                throw new Error( 'Network response was not ok' );
            }
            return response.json();
        } )
        .then( data => {
            createSteps( data );
            showStep();

            $( document ).find( '#steps_form input[type="radio"]' ).each( function( i, input ) {
                $( input ).on( 'change', function() {
                    let yPrefix = isYPrefixAdded ? 'y-': '';
                    if ( `${yPrefix}gender` === $( this ).attr( 'name' ) ) {
                        let mainGender = $( this ).val();

                        $( document ).find( `#steps_form .step-fields .step-item [name="${yPrefix}characters"]` ).each( function( indx, character ) {
                            if( $( character ).data( 'gender' ) === mainGender ){
                                $( character ).closest( '.character-item' ).attr( 'style', 'display: block;' );
                            } else {
                                $( character ).closest( '.character-item' ).attr( 'style', 'display: none;' );
                            };
                        } );
                        updateAvatarBasedOnGender( $( this ).val() );
                    } else if ( `${yPrefix}characters` === $( this ).attr( 'name' ) ) {
                        let gender = $( this ).data( 'gender' );
                        console.log(yPrefix+"characters:: "+gender );
                        let src = $( this ).siblings( '.choose-image-label' ).find( 'img' ).attr( 'src' );
                        updateAvatarBasedOnGender( gender, src );
                    } 
                } )
            } )
        } )
        .catch( error => {
            console.error( 'Error fetching JSON:', error );
        } );
    }

    loadFormData();

    function showStep() {
        index = currentTab;

        $( '.step-title .step-number' ).text( currentStep+1 );
        $( '.step-title .step-count' ).text( maxSteps );
        $( '.step-wrap .step-subtitle' ).text( subtitles[currentStep] );
        
        let tabsSteps = $( document ).find( '.form' );

        tabsSteps.each( function( idx, el ) {
            let navs = $( el ).find( '.tab-nav-item' );
            let stepFields = $( el ).closest( '.form' ).find( '.step-fields .step-item' );

            if ( idx === currentStep ) {
                $( el ).css( "display: block;" );
                $( el ).removeClass( 'd-none' );

                navs.each( function( navInx, nav ) {
                    if( navInx === index ) {
                        $( nav ).addClass( 'active' );
                    } else {
                        $( nav ).removeClass( 'active' );
                    }
                } );

                stepFields.each( function( stepInx, step ) {
                    if( $( step ).hasClass( `step-${index}` ) ) {
                        $( step ).attr( 'style', 'display: block;' );
                    } else {
                        $( step ).removeAttr( 'style' );
                    }
                } )
            } else {
                $( el ).css( "display: none;" );
                $( el ).addClass( 'd-none' );

                navs.each( function( navInx, nav ) {
                    $( nav ).removeClass( 'active' );
                } );
            }
        } )

    }

    function updateAvatarBasedOnGender( gender , src = '' ) {
        let previweContainer = $( document ).find( '.avatar-preview-container' );
        console.log("Gender:: "+gender);
        if( '' === src ){
            let prefix = isYPrefixAdded ? 'y-' : '';
            src    = `assets/img/${ gender === 'boy' ? `${ prefix }avatar-04.png` : `g-${ prefix }avatar-04.png` }`;
            previweContainer.removeClass( 'active' );
        } else {
            previweContainer.addClass( 'active' );
        }

        avatarPreview.attr( 'src', src );
    }

    $( document ).on( 'click', '.tab-nav-item' , function( event ) {
        currentTab = $( this ).data( 'tab' );

        if( currentTab > doneTabs ) {
            return;
        }

        showStep();
    } );

    function validateRadioInputs( inputs ) {
        const errorText = "Oops! Don't forget to fill this in.";
        const errors = [];
      
        inputs.each( function( idx, input ) {
          const type = $( input ).attr( 'type' );
          const name = $( input ).attr( 'name' );
          const errorCheck = errors.indexOf( name );
      
          if ( type === 'radio' ) {
            const wrapper = $( input ).closest( '.radiogroup, .character-wrap' );
            const checkedLength = wrapper.find( 'input:checked' ).length;
            const errorMessage = wrapper.find( '.error-message' );
      
            if ( checkedLength > 0 ) {
              wrapper.removeClass( 'error' );
              if ( errorMessage.length > 0 ) {
                errorMessage.remove();
              }
              if ( errorCheck > -1 ) {
                errors.splice( errorCheck, 1 );
              }
            } else {
              wrapper.addClass( 'error' );
              if ( errorMessage.length === 0 ) {
                wrapper.append( `<span class="error-message">${errorText}</span>` );
              }
              if ( errorCheck === -1 ) {
                errors.push( name );
              }
            }
          }
        });
      
        return errors;
    }
      
    function validateTextInput( input ) {
    const errorText = "Oops! Don't forget to fill this in.";
    const youngestNameRegex = /^[A-Za-z]+$/;
    const name = $( input) .attr( 'name' );
    const wrapper = $( input ).closest( '.form-group' );
    const errorMessage = wrapper.find( '.error-message' );
    const value = $( input ).val().trim();
    
    if ( value.length > 0 ) {
        $( input ).removeClass( 'error' );
        if ( errorMessage.length > 0 ) {
        errorMessage.remove();
        }
        if ( name === 'child-name' ) {
        if ( !youngestNameRegex.test( value ) ) {
            $( input ).addClass( 'error' );
            if ( errorMessage.length === 0 ) {
            wrapper.append( `<span class="error-message">Whoops! This contains unsupported characters. Try again.</span>` );
            }
            return true; // Indicate an error
        }
        }
    } else {
        $( input ).addClass( 'error' );
        if ( errorMessage.length === 0 ) {
        wrapper.append( `<span class="error-message">${errorText}</span>` );
        }
        return true; // Indicate an error
    }
    
    return false; // Indicate no error
    }
      
    function defaultValidateFields( inputs ) {
    const radioErrors = validateRadioInputs( inputs );
    const textErrors = [];
    
    inputs.each( function( idx, input ) {
        const type = $( input ).attr( 'type' );
        if ( type === 'text' ) {
        if ( validateTextInput( input ) ) {
            textErrors.push( $( input ).attr( 'name' ) );
        }
        }
    });
    
    return radioErrors.concat( textErrors ).length === 0;
    }

    $( document ).on( 'click', '.step-actions .submit-btn', function( event ) {
        event.preventDefault();

        setTimeout( () => {
            let activeInputs = $( this ).closest( '.form' ).find( `.step-${ currentTab } input` );
    
            let isValid = defaultValidateFields( activeInputs );
    
            if ( isValid ) {
                ++currentTab;
                ++doneTabs;
                // Tabs
                if ( currentTab < maxTabs ) {
                    showStep();
                } else {
                    // Steps
                    ++doneSteps;
                    if ( currentStep+1 < maxSteps ) {
                        ++currentStep;
                        currentTab = 0;
                        isYPrefixAdded = true;
                        doneTabs = 0;
                        updateAvatarBasedOnGender( 'boy' );
                        showStep();
                    } else {
                        // Finished
                        window.location.href = './preview.html';
                    }
                }
            } else {
                return false;
            }
        }, 100 );
    } );


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
} )