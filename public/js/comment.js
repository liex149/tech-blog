const commentFormHandler = async (event) => {
    event.preventDefault();

    const post = document.querySelector('#comment').value.trim();
    const blogPost_id = document.getElementsByClassName('card')
    const bpid = blogPost_id[0].id
    console.log(bpid)
    if (post) {
        const response = await fetch(`/comment/${bpid}`, {
            method: 'POST', 
            body: JSON.stringify({ post, bpid}),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace(`/comment/${bpid}`);
        } else {
            alert('Unable to comment!');
        }
    }

};

document
.querySelector('.comment-form')
.addEventListener('submit', commentFormHandler);