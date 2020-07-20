import autocomplete from 'autocompleter';
import { Data } from './data';

class Search {
  static games = null;

  static strip(string) {
    return string.trim().split(' ').map((word) => {
      let match = word.toLowerCase().match(/[a-zа-я0-9]+/g);
      return match ? match.join('') : '';
    }).join(' ');
  }

  static async load() {
    if (Search.games != null) return Search.games;

    let categories = await Data.categories();

    Search.games = Object.keys(categories).flatMap((key) => {
      let category = categories[key];
      return category.games.flatMap((game) => {
        game.group = category.name;

        let names = game.name.split(' / ');

        if (names.length > 1) {
          return names.map((name) => {
            let subref = Object.assign({}, game);
            subref.name = name;
            return subref;
          });
        } else {
          return game;
        }
      });
    });

    return Search.games;
  }

  static async init(selector) {
    let games = await Search.load();

    let segments = await Data.segments();
    let segment_keys = Object.keys(segments);

    return autocomplete({
      minLength: 2,
      input: document.querySelector(selector),
      fetch: (text, update) => {
        text = Search.strip(text);

        if (segment_keys.indexOf(text) !== -1) {
          update(segment_keys.filter((key) => key.startsWith(text)).map((key) => {
            let segment = segments[key];
            return {
              name: segment.name,
              group: 'Переход по ID',
              url: segment.url
            };
          }));
          return;
        }

        let suggestions = games.filter((x) => {
          if (text.indexOf(' ') != -1) {
            return Search.strip(x.name).indexOf(text) != -1;
          } else {
            let words = Search.strip(x.name).split(' ');
            return words.filter(y => y.startsWith(text)).length > 0;
          }
        });

        update(suggestions);
      },
      render: (item, currentValue) => {
        let div = document.createElement("div");
        let html = item.name;
        if (item.year) { html += ' - <span>' + item.year + '</span>'; }
        div.innerHTML = html;
        return div;
      },
      onSelect: (item) => {
        window.location = item.url;
      }
    });
  }
}

export { Search };
