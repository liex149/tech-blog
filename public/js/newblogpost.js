const commentFormHandler = async (event) => {
    event.preventDefault();

    const post = document.querySelector('#newblog').value.trim();

    const newblog_id = document.querySelector('#newblog_id').value.trim();
    
    if (post) {
        const response = await fetch('/newblog', {
            method: 'POST',
            body: JSON.stringify({ post, newblog_id}),
            headers: {
                'Content_Type': 'application/json',
            }
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
.addEventListener('submit', commentFormHandler);