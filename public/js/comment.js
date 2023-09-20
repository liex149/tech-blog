const commentFormHandler = async (event) => {
    event.preventDefault();

    const post = document.querySelector('#comment').value.trim();
    const blogPost_id = 2
console.log(post)
    if (post) {
        const response = await fetch(`/comment/2`, {
            method: 'POST', 
            body: JSON.stringify({ post, blogPost_id}),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace(`/comment/`);
        } else {
            alert('Unable to comment!');
        }
    }

};

document
.querySelector('.comment-form')
.addEventListener('submit', commentFormHandler);