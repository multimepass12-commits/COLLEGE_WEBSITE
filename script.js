document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu --- //
    const navLinks = document.getElementById("navLinks");
    const menuOpen = document.getElementById("menu-open");
    const menuClose = document.getElementById("menu-close");

    if (menuOpen) {
        menuOpen.addEventListener('click', () => {
            navLinks.style.right = "0";
        });
    }

    if (menuClose) {
        menuClose.addEventListener('click', () => {
            navLinks.style.right = "-200px";
        });
    }

    // --- Inline Form Validation --- //
    const forms = [document.getElementById('contactForm'), document.getElementById('commentForm')];

    const showError = (input, message) => {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message');
        input.classList.add('input-error');
        error.textContent = message;
    };

    const clearError = (input) => {
        const formGroup = input.parentElement;
        const error = formGroup.querySelector('.error-message');
        input.classList.remove('input-error');
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

        if (value === '') {
            showError(input, `${input.name.charAt(0).toUpperCase() + input.name.slice(1)} is required.`);
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(value)) {
            showError(input, 'Please enter a valid email address.');
            isValid = false;
        }
        return isValid;
    };

    forms.forEach(form => {
        if (form) {
            const inputs = form.querySelectorAll('input, textarea');

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
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let searchData = [];

    if (searchInput) {
        // Fetch search data
        fetch('search-data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                searchData = data;
            })
            .catch(error => console.error('Error loading search data:', error));

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length > 1) {
                const results = searchData.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    item.content.toLowerCase().includes(query)
                );
                displayResults(results);
            } else {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
            }
        });

        const displayResults = (results) => {
            searchResults.innerHTML = '';
            if (results.length === 0) {
                searchResults.innerHTML = '<li><a href="#" onclick="return false;">No results found</a></li>';
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
                    searchResults.appendChild(li);
                });
            }
            searchResults.style.display = 'block';
        };

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });
    }
});
