document.addEventListener('DOMContentLoaded', function () {

    // --- Accessible Mobile Menu --- //
    const navLinks = document.getElementById("navLinks");
    const menuOpenBtn = document.getElementById("menu-open");
    const menuCloseBtn = document.getElementById("menu-close");

    if (menuOpenBtn && navLinks) {
        menuOpenBtn.addEventListener('click', () => {
            navLinks.style.right = "0";
            menuOpenBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    if (menuCloseBtn && navLinks) {
        menuCloseBtn.addEventListener('click', () => {
            navLinks.style.right = "-200px";
            menuOpenBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto'; // Restore scrolling
        });
    }

    // --- Inline Form Validation --- //
    const forms = [document.getElementById('contactForm'), document.getElementById('commentForm')];

    const showError = (input, message) => {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message');
        input.classList.add('input-error');
        input.setAttribute('aria-invalid', 'true');
        error.textContent = message;
    };

    const clearError = (input) => {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message');
        input.classList.remove('input-error');
        input.removeAttribute('aria-invalid');
        error.textContent = '';
    };

    const isValidEmail = (email) => {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    };

    const validateField = (input) => {
        clearError(input);
        let isValid = true;
        const value = input.value.trim();

        if (input.required && value === '') {
            showError(input, `${input.placeholder} is required.`);
            isValid = false;
        } else if (input.type === 'email' && value !== '' && !isValidEmail(value)) {
            showError(input, 'Please enter a valid email address.');
            isValid = false;
        }
        return isValid;
    };

    forms.forEach(form => {
        if (form) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');

            form.addEventListener('submit', function (e) {
                let isFormValid = true;
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isFormValid = false;
                    }
                });

                if (!isFormValid) {
                    e.preventDefault();
                } else {
                    // For demo purposes, prevent actual submission and show a message
                    e.preventDefault();
                    alert('Form submitted successfully!');
                    form.reset();
                    inputs.forEach(input => clearError(input));
                }
            });

            inputs.forEach(input => {
                input.addEventListener('input', () => validateField(input));
            });
        }
    });

    // --- Global Search --- //
    const searchContainers = document.querySelectorAll('.search-container');
    let searchData = [];
    let isDataFetched = false;

    // Fetch search data once
    fetch('search-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            searchData = data;
            isDataFetched = true;
        })
        .catch(error => {
            console.error('Error loading search data:', error);
            // Optionally, disable search inputs or show an error message
            searchContainers.forEach(container => {
                const resultsList = container.querySelector('ul');
                if (resultsList) {
                    resultsList.innerHTML = '<li><a href="#" onclick="return false;">Search unavailable</a></li>';
                }
            });
        });

    searchContainers.forEach(container => {
        const searchInput = container.querySelector('input[type="text"]');
        const searchResults = container.querySelector('ul');

        if (!searchInput || !searchResults) return;

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length > 1) {
                if (!isDataFetched) {
                    searchResults.innerHTML = '<li><a href="#" onclick="return false;">Loading...</a></li>';
                    searchResults.style.display = 'block';
                    return;
                }
                const results = searchData.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    item.content.toLowerCase().includes(query)
                );
                displayResults(results, searchResults);
            } else {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
            }
        });
    });

    const displayResults = (results, resultsList) => {
        resultsList.innerHTML = '';
        if (results.length === 0) {
            resultsList.innerHTML = '<li><a href="#" onclick="return false;">No results found</a></li>';
        } else {
            results.slice(0, 5).forEach(result => { // Show top 5 results
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = result.url;
                
                const titleSpan = document.createElement('span');
                titleSpan.textContent = result.title;
                titleSpan.style.fontWeight = 'bold';

                const contentP = document.createElement('p');
                contentP.textContent = `${result.type}: ${result.content.substring(0, 60)}...`;
                
                a.appendChild(titleSpan);
                a.appendChild(contentP);
                li.appendChild(a);
                resultsList.appendChild(li);
            });
        }
        resultsList.style.display = 'block';
    };

    // Hide results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchContainers.forEach(container => {
                const searchResults = container.querySelector('ul');
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            });
        }
    });
});
