export default function debounce(func, delay) {
  let timeout;

  return function(event) {
    if (event && event.persist) {
      event.persist();
    }

    const context = this, args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function() {
      timeout = null;

      func.apply(context, args);
    }, delay);
  }
}
