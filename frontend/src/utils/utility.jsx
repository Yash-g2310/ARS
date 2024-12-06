export function getCookie(name) {
    let cookieValue = null;
    const cookies = document.cookie.split(';');
    if (document.cookie && document.cookie !== '') {
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}