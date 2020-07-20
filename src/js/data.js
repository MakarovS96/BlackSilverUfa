
class Data {
  static _categories = null;
  static _segments = null;

  static async segments() {
    if (Data._segments == null) {
      Data._segments = fetch('/data/segments.json').then((res) => res.json());
    }
    return Data._segments;
  }

  static async categories() {
    if (Data._categories == null) {
      Data._categories = fetch('/data/categories.json').then((res) => res.json());
    }
    return Data._categories;
  }
}

export { Data };
