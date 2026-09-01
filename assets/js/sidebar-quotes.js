(function () {
  var quoteBlock = document.querySelector('[data-sidebar-quote]');
  var quotesScript = document.querySelector('[data-sidebar-quotes]');

  if (!quoteBlock || !quotesScript) {
    return;
  }

  var quotes = [];

  try {
    quotes = JSON.parse(quotesScript.textContent || '[]');
  } catch (error) {
    quotes = [];
  }

  if (!Array.isArray(quotes) || quotes.length === 0) {
    return;
  }

  var currentText = quoteBlock.querySelector('p') ? quoteBlock.querySelector('p').textContent.trim() : '';
  var previousQuoteKey = null;

  try {
    previousQuoteKey = window.sessionStorage.getItem('sidebarQuote');
  } catch (error) {
    previousQuoteKey = null;
  }

  var availableQuotes = quotes.filter(function (quote) {
    return quote && quote.text && quote.text.trim() && quote.text.trim() !== currentText;
  });

  if (availableQuotes.length === 0) {
    availableQuotes = quotes;
  }

  var selectedQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)];
  var selectedKey = selectedQuote.text + '|' + (selectedQuote.source || '');

  if (previousQuoteKey && availableQuotes.length > 1 && selectedKey === previousQuoteKey) {
    selectedQuote = availableQuotes[(availableQuotes.indexOf(selectedQuote) + 1) % availableQuotes.length];
    selectedKey = selectedQuote.text + '|' + (selectedQuote.source || '');
  }

  quoteBlock.querySelector('p').textContent = selectedQuote.text;
  quoteBlock.querySelector('footer').textContent = selectedQuote.source || '';

  try {
    window.sessionStorage.setItem('sidebarQuote', selectedKey);
  } catch (error) {
    // Ignore storage errors and leave the quote as selected for this page load.
  }
}());
