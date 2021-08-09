import { useState, useRef, useEffect, useCallback } from 'react';
// import { useInView } from 'react-intersection-observer';
import { Button } from 'react-bootstrap';
import styles from './InfiniteCarouselScroll.module.css';

const FN = () => {
  const loader = useRef(null);
  const [items, setItems] = useState<string[]>([]);
  // const [hasMore, setHasMore] = useState<boolean>(true);
  // const [data, setData] = useState<number[]>([]);
  // useEffect(() => {
  //   setData([...new Array(11).keys()].map((n) => n));
  // }, []);
  // const [values, setValues] = useState<number[]>([]);
  const loadMore = useCallback(
    (entries) => {
      if (entries[0].isIntersecting) {
        const res: string[] = [];
        for (let i = 1; i < 10; i += 1) {
          res.push(`${Math.random()}${i}`);
        }
        setItems([...items, ...res]);
        // setValues(items);
      }
      // console.log(items);
    },
    [items],
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.25,
    };
    const observer = new IntersectionObserver(loadMore, options);
    if (loader && loader.current) observer.observe(loader.current!);
  }, [loader, loadMore]);

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          setItems([]);
        }}
      >
        clear
      </Button>
      <div className={styles.scroller}>
        <h2>Header inside viewport.</h2>
        <ul>
          {/* <li>1</li>
        <li>1</li>
                 
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li>
        <li>1</li> */}
          {items.map((n) => (
            <li key={n} style={{ height: '100px' }}>
              <h2>Number: ${n}</h2>
              <p>asd as ${n}</p>
            </li>
          ))}
        </ul>
        <li ref={loader}>More</li>
      </div>
    </>
  );
};

export default FN;
