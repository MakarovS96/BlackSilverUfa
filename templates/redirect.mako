<%! from templates.utils import md5file %>
<html>
<head>
  <title>Перенаправление</title>
  <meta charset="UTF-8">
  <script src="/search.js?hash=${md5file(_('search.js'))}"></script>
</head>
<body>
  <a href="/" id="link">Нажмите сюда, если перенаправление не сработало</a>

  <script type="text/javascript">
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    };

    var hash = getQueryVariable('s') || window.location.search.substring(1);
    if (hash.split('.').length > 1 && hash.split('.')[1] == 0) {
      hash = hash.split('.')[0];
    }

    Redirect.go(hash);
    document.getElementById('link').setAttribute("href", Redirect.link(hash));
  </script>
</body>
</html>
