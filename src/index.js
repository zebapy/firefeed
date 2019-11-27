import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Parser from 'rss-parser/dist/rss-parser.min';
import dayjs from 'dayjs';

let parser = new Parser();

const useFeed = url => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
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
        setLink(feed.link);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    loadFeed();
  }, [url]);

  return { title, items, loading, link };
};

const Article = ({ pubDate, title, link, contentSnippet }) => (
  <article className="rounded box-shadow bg-white p-6">
    <time dateTime={pubDate} className="text-sm mb-2 uppercase tracking-wide">
      {dayjs(pubDate).format('MMM D, YYYY')}
    </time>
    <h3 className="text-2xl font-semibold mb-4">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-500"
      >
        {title}
      </a>
    </h3>
    <div className="relative">
      <p
        className="text-gray-800"
        style={{
          height: 80,
          overflow: 'hidden'
        }}
        dangerouslySetInnerHTML={{ __html: contentSnippet }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent, white)'
        }}
      />
    </div>
  </article>
);

const FeedList = ({ url }) => {
  const { title, items, loading, link } = useFeed(url);

  if (loading) {
    return 'Loading...';
  }

  return (
    <section className="mb-8 px-8 flex-auto border-r" style={{ width: 400 }}>
      <h2 className="uppercase tracking-wide mb-6 font-semibold">
        <a href={link}>{title}</a>
      </h2>
      <ul
        className=""
        style={{
          overflowY: 'auto'
        }}
      >
        {items.slice(0, 10).map(item => (
          <li key={item.title} className="mb-8">
            <Article {...item} />
          </li>
        ))}
      </ul>
    </section>
  );
};

function App() {
  return (
    <div className="font-sans text-lg bg-gray-200">
      <header className="text-center py-8 mb-8">
        <h1 className="text-2xl">
          <span role="img" aria-label="Fire icon">
            🔥
          </span>{' '}
          FireFeed
        </h1>
        <p className="text-xl">
          All your favorite{' '}
          <abbr title="Financial Independence, Retire Early">Fire</abbr>{' '}
          movement blogs in one place
        </p>
      </header>
      <div className="flex">
        {/* <FeedList url={REDDIT_FEED} /> */}
        <FeedList url="https://www.mrmoneymustache.com/feed/" />
        <FeedList url="https://www.gocurrycracker.com/feed/" />
        <FeedList url="https://frugalwoods.com/feed" />
        <FeedList url="https://choosefi.com/feed" />
        <FeedList url="https://www.reddit.com/r/financialindependence/.rss" />
        <FeedList url="https://jlcollinsnh.com/feed/" />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
