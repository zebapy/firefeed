import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Parser from 'rss-parser/dist/rss-parser.min';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import './styles.css';

let parser = new Parser();

const REDDIT_FEED = 'https://www.reddit.com/.rss';

const useFeed = url => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    const loadFeed = async () => {
      setLoading(true);
      try {
        let feed = await parser.parseURL(CORS_PROXY + url);
        console.log(feed);
        setLoading(false);
        setTitle(feed.title);
        setItems(feed.items);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    loadFeed();
  }, [url]);

  return { title, items, loading };
};

const FeedList = ({ url }) => {
  const { title, items, loading } = useFeed(url);

  if (loading) {
    return (
      <Loader
        type="MutatingDots"
        color="tomato"
        height={64}
        width={64}
        timeout={3000} //3 secs
      />
    );
  }

  return (
    <section className="feed">
      <h2>{title}</h2>
      <ul>
        {items.map(item => (
          <li key={item.title}>
            <article className="article">
              <h3>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </h3>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <span role="img" aria-label="Fire icon">
            🔥
          </span>{' '}
          FireFeed
        </h1>
        <p className="app-intro">
          All your favorite{' '}
          <abbr title="Financial Independence, Retire Early">Fire</abbr>{' '}
          movement blogs in one place
        </p>
      </header>
      <div className="feeds">
        {/* <FeedList url={REDDIT_FEED} /> */}
        <FeedList url="https://www.mrmoneymustache.com/feed/" />
        <FeedList url="https://www.gocurrycracker.com/feed/" />
        <FeedList url="https://jlcollinsnh.com/feed/" />
        <FeedList url="https://frugalwoods.com/feed" />
        <FeedList url="https://www.reddit.com/r/financialindependence/.rss" />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
