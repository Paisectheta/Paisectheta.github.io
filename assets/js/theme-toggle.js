(function () {
  var root = document.documentElement;
  var button = document.querySelector('.theme-toggle');
  var label = button && button.querySelector('[data-theme-label]');
  var toast = document.getElementById('theme-warning');
  var storedTheme = null;
  var toggleCount = 0;
  var lastToggleAt = 0;
  var toastTimeout = null;

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

  function showThemeWarning() {
    if (!toast) {
      return;
    }

    toast.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(function () {
      toast.classList.remove('visible');
    }, 1800);
  }

  applyTheme(root.getAttribute('data-theme') || storedTheme || 'light');

  button.addEventListener('click', function () {
    var now = Date.now();
    if (now - lastToggleAt < 1200) {
      toggleCount += 1;
    } else {
      toggleCount = 1;
    }
    lastToggleAt = now;

    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

    if (toggleCount >= 6) {
      showThemeWarning();
      toggleCount = 0;
    }
  });
}());
