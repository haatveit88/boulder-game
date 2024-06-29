document.getElementById('new-session').addEventListener('click', () => {
    fetch('/new-session')
        .then(response => response.url)
        .then(url => {
            window.location.href = url;
        })
        .catch(error => console.error('Error:', error));
});
