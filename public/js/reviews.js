// Add event listeners to all comment forms
document.querySelectorAll('.comment-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const content = form.querySelector('textarea[name="content"]').value;
    const reviewId = Number(form.querySelector('input[name="reviewId"]').value);
    try {
      const response = await fetch('/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, reviewId }),
      });
      if (response.ok) {
        alert('Comment successfully added!');
        location.reload(); // Reload to show the new comment
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  });
});
