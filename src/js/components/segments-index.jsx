import React from 'react';
import LazyLoad from 'react-lazyload';
import MediaQuery from 'react-responsive';
import { Data } from '../data';

class SegmentCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      thumbnail: null
    };
  }

  badge() {
    return (
      <div className="card-img-overlay card-badge">
        <span className="badge badge-primary">
          {this.props.badge}
        </span>
      </div>
    );
  }

  overlay() {
    return (
      <div className="card-img-overlay overlay-transparent-bottom bg-dark text-white">
        {this.props.name}
      </div>
    );
  }

  img(src) {
    return <img className="card-img-top" src={src} />;
  }

  componentDidMount() {
    if (!this.state.loaded) {
      this.loadThumbnail().then((url) => {
        this.setState({
          loaded: true,
          thumbnail: url
        });
      });
    }
  }

  async loadThumbnail() {
    let segments = await Data.segments();
    let segment = segments[this.props.segment];

    if (segment.youtube) {
      return `https://img.youtube.com/vi/${segment.youtube}/mqdefault.jpg`;
    } else {
      return null;
    }
  }

  thumbnail() {
    if (this.state.thumbnail) {
      return (
        <LazyLoad
          placeholder={this.img('/static/images/no-preview.png')}
          resize={true}
          offset={200}>
          {this.img(this.state.thumbnail)}
        </LazyLoad>
      );
    } else {
      return this.img('/static/images/no-preview.png')
    }
  }

  render() {
    return (
      <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2 col-card">
        <div className="card">
          <a href={this.props.url}>
            {this.thumbnail()}
            {this.overlay()}
            {this.props.badge ? this.badge() : null}
          </a>
        </div>
      </div>
    );
  }
}

class SegmentGrid extends React.Component {
  separator(text) {
    return (
      <div key={text} className="col-12">
        <div className="hr-sect">
          ↓ {text} ↓
        </div>
      </div>
    );
  }

  items() {
    let current_year = this.props.games[0].year;

    return this.props.games.map((game) => {
      let card = <SegmentCard key={game.url} {...game} />;

      if (this.props.split_by_year != false && game.year != current_year) {
        current_year = game.year;
        return [
          this.separator(`${game.year} год`),
          card
        ];
      } else {
        return card;
      }
    });
  }

  render() {
    return (
      <div className="row d-none d-flex">
        {this.items()}
      </div>
    );
  }
}

class SegmentItem extends React.Component {
  badge() {
    return (
      <span className="badge badge-primary">
        {this.props.badge}
      </span>
    );
  }

  render() {
    return (
      <li className="list-group-item d-flex justify-content-between align-items-center">
        <a href={this.props.url}>{this.props.name}</a>
        {this.props.badge ? this.badge() : null}
      </li>
    );
  }
}

class SegmentList extends React.Component {
  separator(text) {
    return (
      <div key={text} className="col-12">
        <div className="hr-sect">
          ↓ {text} ↓
        </div>
      </div>
    );
  }

  items() {
    let current_year = this.props.games[0].year;

    return this.props.games.map((game) => {
      let item = <SegmentItem key={game.url} {...game} />;

      if (this.props.split_by_year != false && game.year != current_year) {
        current_year = game.year;
        return [
          this.separator(`${game.year} год`),
          item
        ];
      } else {
        return item;
      }
    });
  }

  render() {
    return (
      <ul className="list-group">
        {this.items()}
      </ul>
    );
  }
}

class Category extends React.Component {
  title() {
    return React.createElement(
      `h${this.props.level || 2}`,
      { id: this.props.code, key: 'title' },
      this.props.name
    );
  }

  render() {
    return [
      this.title(),
      this.props.description ?
        <p key="description">{this.props.description}</p> :
        null,
      <MediaQuery minDeviceWidth={450} key="grid">
        <SegmentGrid
          games={this.props.games}
          split_by_year={this.props.split_by_year} />
      </MediaQuery>,
      <MediaQuery maxDeviceWidth={449} key="list">
        <SegmentList
          games={this.props.games}
          split_by_year={this.props.split_by_year} />
      </MediaQuery>
    ];
  }
}

class SegmentsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      error: false,
      categories: {},
      segments: {},
      segment_keys: []
    };
  }

  loadData() {
    Promise.all([Data.categories(), Data.segments()]).then((data) => {
      this.setState({
        loaded: true,
        error: false,
        categories: data[0],
        segments: data[1],
        segment_keys: Object.keys(data[1]).sort((a, b) => String(a).localeCompare(b))
      })
    }).catch((err) => {
      console.log(err);
      this.setState({ error: true });
    });
  }

  componentDidMount() {
    if (!this.state.loaded) {
      this.loadData();
    }
  }

  loading() {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border big" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  retry() {
    if (this.state.error) {
      this.setState({ error: false });
      this.loadData();
    }
  }

  error() {
    return (
      <div className="text-center">
        <h1>Ошибка!</h1>
        <p>Не удалось загрузить категории</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {this.retry()}}>
          Попробовать снова
        </button>
      </div>
    );
  }

  render() {
    if (this.state.error) {
      return this.error();
    }

    if (!this.state.loaded) {
      return this.loading();
    }

    let recent = {
      name: "Недавние стримы",
      code: "recent",
      level: 2,
      split_by_year: false,
      games: this.state.segment_keys.slice(-11, -1).map((key) => {
        let segment = this.state.segments[key];
        return {
          name: segment.name,
          url: segment.url,
          segment: key
        };
      })
    };

    let categories = [];
    categories.push(<Category key="recent" {...recent} />);
    categories.push(...Object.values(this.state.categories).map((category) => {
      return <Category key={category.code} {...category} />;
    }))
    return categories;
  }
}

export { SegmentsIndex };
