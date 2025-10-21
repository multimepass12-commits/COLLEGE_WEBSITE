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

    // --- Form Validation --- //

    // Helper function to validate email
    function isValidEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            const name = contactForm.querySelector('input[name="name"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const subject = contactForm.querySelector('input[name="subject"]').value.trim();
            const message = contactForm.querySelector('textarea[name="message"]').value.trim();

            if (name === '' || email === '' || subject === '' || message === '') {
                e.preventDefault();
                alert('Please fill out all fields.');
                return;
            }

            if (!isValidEmail(email)) {
                e.preventDefault();
                alert('Please enter a valid email address.');
                return;
            }
        });
    }

    // Comment Form Validation
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent actual submission for this demo

            const name = commentForm.querySelector('input[name="name"]').value.trim();
            const email = commentForm.querySelector('input[name="email"]').value.trim();
            const comment = commentForm.querySelector('textarea[name="comment"]').value.trim();

            if (name === '' || email === '' || comment === '') {
                alert('Please fill out all fields.');
                return;
            }

            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            alert('Thank you for your comment!');
            commentForm.reset();
        });
    }
});
