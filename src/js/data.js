
class Data {
  static _categories = null;
  static _segments = null;

  static async segments() {
    if (Data._segments != null) return Data._segments;
    let data = await fetch('/data/segments.json').then((res) => res.json());
    Data._segments = data;
    return data;
  }

  static async categories() {
    if (Data._categories != null) return Data._categories;
    let data = await fetch('/data/categories.json').then((res) => res.json());
    Data._categories = data;
    return data;
  }
}

export { Data };
