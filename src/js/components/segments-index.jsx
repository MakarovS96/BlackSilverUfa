import React from 'react';
import LazyLoad from 'react-lazyload';
import MediaQuery from 'react-responsive';

class SegmentCard extends React.Component {
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

  thumbnail() {
    if (this.props.thumbnail) {
      return (
        <LazyLoad
          placeholder={this.img('/static/images/no-preview.png')}
          resize={true}
          offset={200}>
          {this.img(this.props.thumbnail)}
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
  render() {
    return Object.values(this.props.data).map((category) => {
      return <Category key={category.code} {...category} />;
    });
  }
}

export { SegmentsIndex };
