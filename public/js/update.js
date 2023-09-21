const updateFormHandler = async (event) => {
    event.preventDefault();

    // Collect values from the update
    const title = document.querySelector('#title').value.trim();
    const description = document.querySelector('#description').value.trim();
    const blogPost_id = document.getElementsByClassName('form')
    const bpid = blogPost_id[0].id
    if (title && description && bpid) {
      // Send a PUT request to the API endpoint
      const response = await fetch(`/update/${bpid}`, {
        method: 'PUT',
        body: JSON.stringify({ title, description, bpid }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        // If successful, redirect the browser to the dashboard page
        document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }

  };

  document.querySelector('.update-form').addEventListener('submit', updateFormHandler);
  