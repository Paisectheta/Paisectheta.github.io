(function () {
  var root = document.documentElement;
  var button = document.querySelector('.theme-toggle');
  var label = button && button.querySelector('[data-theme-label]');
  var storedTheme = null;

  if (!button || !label) {
    return;
  }

  try {
    storedTheme = window.localStorage.getItem('theme');
  } catch (error) {
    storedTheme = null;
  }

  function applyTheme(theme) {
    var nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    button.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    label.textContent = nextTheme === 'dark' ? 'Light mode' : 'Dark mode';

    try {
      window.localStorage.setItem('theme', nextTheme);
    } catch (error) {
      // Ignore storage failures and keep the theme change applied for this session.
    }
  }

  applyTheme(root.getAttribute('data-theme') || storedTheme || 'light');

  button.addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}());
