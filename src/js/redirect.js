import { Data } from './data';

class Redirect {
  static async link(hash) {
    let segments = await Data.segments();
    let dest = segments[hash];

    if (dest !== undefined) {
      return dest.url;
    } else {
      return '/';
    }
  }

  static async go(hash) {
    let path = document.location.pathname + document.location.hash;
    let dest = await Redirect.link(hash);

    if (path != dest) {
      window.location.replace(dest);
    }
  }

  static getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
  }

  static detect() {
    var hash = Redirect.getQueryVariable('s') || window.location.search.substring(1);

    if (hash.split('.').length > 1 && hash.split('.')[1] == 0) {
      hash = hash.split('.')[0];
    }

    Redirect.go(hash);
  }
}

export { Redirect };
