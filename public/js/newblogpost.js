const blogFormHandler = async (event) => {
    event.preventDefault();


    const post = document.querySelector('#newblog').value.trim();
    const desc = document.querySelector('#desc').value.trim();

    if (post) {
        const response = await fetch('/newblog', {
            method: 'POST',
            body: JSON.stringify({ post, desc }),
            headers: {'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace(`/dashboard`);
        } else {
            alert('Failed to create!')
        }
    }
};


document
.querySelector('.newblog-form')
.addEventListener('submit', blogFormHandler);