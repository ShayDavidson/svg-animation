import React, {
  useLayoutEffect,
  useCallback,
  useState,
  useEffect,
} from 'react';
import './App.css';

function useRequestAnimationFrame(externalStepFunction, deps) {
  useLayoutEffect(() => {
    let lastTime = new Date();
    let animationFrame;
    const internalStepFunction = () => {
      animationFrame = window.requestAnimationFrame(() => {
        const newTime = new Date();
        const dt = externalStepFunction(newTime - lastTime);
        lastTime = newTime;
        internalStepFunction(dt);
      });
    };
    internalStepFunction();
    return () => cancelAnimationFrame(animationFrame);
  }, [deps, externalStepFunction]);
}

function getPageScroll() {
  const absoluteScroll = window.scrollY;
  const contentHeight = document.documentElement.scrollHeight;
  const relativeScroll = absoluteScroll / (contentHeight - window.innerHeight);
  return {
    absoluteScroll,
    relativeScroll: isNaN(relativeScroll) ? 0 : relativeScroll,
  };
}

function usePageScroll() {
  const [{ absoluteScroll, relativeScroll }, setState] = useState(
    getPageScroll()
  );
  useLayoutEffect(() => {
    const handler = () => {
      setState(getPageScroll());
    };
    window.addEventListener('scroll', handler);
    setState(getPageScroll());
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return { absoluteScroll, relativeScroll };
}

const LARGE_ENOUGH_GAP = 1000000;

function SVGSegment({ path, size, offset, ...props }) {
  const style = {
    strokeDashoffset: -offset,
    strokeDasharray: `${size} ${LARGE_ENOUGH_GAP}`,
  };
  return <path d={path} style={style} {...props} />;
}

export function lerp(min, max, t) {
  return min * (1 - t) + max * t;
}

export function inverseLerp(min, max, val) {
  return (val - min) / (max - min);
}

const INITIAL_SIZE = 100;

const MAP = [
  {
    scroll: 0,
    size: 0,
    offset: 0,
  },
  {
    scroll: 0.2,
    size: 2000,
    offset: 5000,
  },
  {
    scroll: 0.3,
    size: 200,
    offset: 8000,
  },
  {
    scroll: 0.4,
    size: 2000,
    offset: 9000,
  },
  {
    scroll: 0.6,
    size: 2000,
    offset: 15000,
  },
  {
    scroll: 0.68,
    size: 1000,
    offset: 16000,
  },
  {
    scroll: 0.75,
    size: 1000,
    offset: 18000,
  },
  {
    scroll: 0.8,
    size: 500,
    offset: 19000,
  },
  {
    scroll: 0.82,
    size: 1000,
    offset: 20000,
  },
  {
    scroll: 0.95,
    size: 1000,
    offset: 25000,
  },
  {
    scroll: 0.97,
    size: 500,
    offset: 26000,
  },
  {
    scroll: 1 + Number.EPSILON,
    size: 0,
    offset: 30000,
  },
];

function App() {
  const path =
    'M151,252.18c-22.75,181.87,82.77,372.6,248.93,450,69.73,32.47,146.51,45.9,221.86,61.38s151.79,34,216.93,74.88,118.09,108.36,122.78,185.15-50.92,158-127.52,165.06-149.46-82.19-114.7-150.82c29.36-58,104.6-69.8,165.33-92.93S1004.81,849,964,798.42c-32.94-40.85-106-19-129.28,28S824.26,930.12,844,978.73s46.39,96,50.3,148.34-24.56,112.39-76.22,121.59-100.33-65.69-59.91-99.14c58.13-5.7,119-12.36,167.19-45.39s77.31-101.65,47.26-151.73c-26.59-44.32-88.58-56.06-137.86-40.49S746,963.8,708.21,999.08c57,2.55,116.42,5.73,166.35,33.42s86.84,87.86,68.82,142c-19.79,59.51-89.57,82-143.6,113.89-95.65,56.4-157.27,166.26-155.51,277.29S711.09,1784.61,808.48,1838c-42.32,60.92-136.47,76.82-197.35,34.43S532.07,1737.7,571,1674.55s128-88.65,195.18-57.07c30.43-45.14-29.31-109.88-81.9-95.86s-79,77.61-70,131.29,43.93,99,78.82,140.74,71.93,84.44,86.81,136.8c17.63,62.08-3,136.13-56.66,172s-137.54,21.49-168.53-35.13c-28.63-52.29-7.08-119.48,30.75-165.56s89.57-78.34,133-119.13,80.44-96.51,73.83-155.76-76.11-110.2-127.64-80.22c-63.76,37.08-32.06,140.2,26.64,184.87s137.08,67,178,128.36c43.06,64.57,29.17,153.56-10,220.59s-99.33,118.57-153,174.66c-154.35,161.36-259.22,369.43-297.11,589.48-11.17,64.85-14.11,139.1,29.61,188.27s147.43,35.7,152.17-29.93c4.08-56.53-62.62-90.75-119-96.49s-120.29-1.43-161.46-40.37c-46.1-43.6-31.72-132.1,25-160.48s134.92,11,147.67,73.21C510,2908.59,298.9,3016.14,355.32,3136c26.16,55.59,108.38,70.81,157.4,33.76s59.81-112.59,30-166.31-93.15-84.16-154.58-82.94c6-63.41,69.06-115.68,132.49-109.84s115.87,68.73,110.21,132.17C621.68,3045.39,489,3114.39,503.45,3216.3c10.6,74.68,96.2,113.69,171.38,119.91s154.64-5.76,223.25,25.59c115.61,52.82,147.45,199.15,164.85,325.06,11.77,85.16,23.49,172.3,6.25,256.53s-69.28,166.47-150,196.07S731.87,4126.73,712.56,4043c-17.36-75.31,35.48-148.1,91.13-201.74s120.83-106.12,138.9-181.27-49.59-171.36-122-144.21c-76.57,28.74-59.22,149,.81,204.53s145,82.37,195,147.12c47.82,62,52.44,153.91,11.1,220.36s-125.89,102.92-202.6,87.4c.33-86.67,87.63-142.58,159.34-191.24s144.5-135.6,104.48-212.47c-25-48.06-86.92-67-140.4-58.41s-100.65,38.83-146.07,68.36c68.19,21.37,138.39,43.82,192.84,90.1s89.59,123,66,190.49c-30.33,86.87-134.23,117.23-220.88,148.16a991.16,991.16,0,0,0-395.13,262c-56.92,62-108.53,142.53-91.56,225s139.8,133.76,188.27,65c-40.79-100.49-135.55-177.14-242.34-196,50.5-40.28,129.52-39.17,178.87,2.5s63.68,119.4,32.43,175.93C476.25,4807,392,4857.87,414.56,4925.68c20.38,61.39,123.93,53.62,150.8-5.22s-9.91-131-64.59-165.56q-1.45-.93-2.94-1.83c-88-53.6-202.65-5-227.41,95.06-99.25,401.21,9.47,855.22,291,1158.25,89.78,96.63,197.65,182.84,249,304.35,18.18,43,28.5,91.37,16.92,136.64s-49.21,85.87-95.74,90.1c-60.29,5.47-111.95-51.41-122.23-111.07s10-120,31.49-176.55a3238.09,3238.09,0,0,1,232.63-485.41c-42-13.34-85.43-25.75-129.47-23.31s-89.45,22.34-111.67,60.44c-41.51,71.21,16.33,162.12,86.31,205.67s155,64.87,213,123.41c69.79,70.41,82.65,190.21,29.39,273.83s-167.26,122.62-260.57,89.15l88.74-190.34c65.86-141.24-44.13-301.3-199.6-290.46l-119.21,8.31c82.43-85.27,205.14-129.8,323.07-117.24,39.52,103.92-28.71,217.86-108.82,295s-178.25,142.63-223,244.38c145.15-15.45,281.66-87.51,381.87-193.34,74.8-79,2.41-207.21-103.9-184h0c-15.28,3.33-31,6.84-43.88,15.69-45,30.88-27.15,105.39,14.59,140.54S808.15,6270,853.69,6300c112,73.89,132,239.26,77.24,361.73s-165.47,209.89-277,284.45-230.37,143.33-316.29,246.38c-43.78,52.52-78.39,128.1-43.81,187.1,31.71,54.11,104.85,65.23,167.5,62.14,38.79-1.91,78.76-7.46,111.89-27.73s57.85-58.42,52-96.83c-9.59-63.5-86.74-88-150.16-98.15s-140.57-31.3-154.17-94.06c-9.57-44.18,24.31-91.41,68.44-101.21s92.11,15,114.27,54.45,19.91,90-.8,130.16c-21,40.7-60.57,77.89-53.59,123.15,8.66,56.23,88.62,74.68,137.12,44.91.86-.53,1.72-1.07,2.57-1.62,65.12-42,39.61-143-37.54-150.37l-275.29-26.27c-37.67-3.59-82.18-11.89-97.33-46.55-11.2-25.62-.23-56.65,19.38-76.58s46.25-31.08,72.32-41.19c66.35-25.72,140.53-48,207.35-23.53s110.11,117.09,62.32,169.82';
  const viewBox = '0 0 1366 7419.1';

  // const [{ size, offset }, setState] = useState({
  //   size: INITIAL_SIZE,
  //   offset: 0,
  // });

  // const step = useCallback(dt => {
  //   setState(({ size, offset }) => {
  //     return { size, offset: offset };
  //   });
  // }, []);

  // useRequestAnimationFrame(step);

  const { relativeScroll } = usePageScroll();
  const index = MAP.findIndex(
    ({ scroll }) => Math.min(1, Math.max(0, relativeScroll)) < scroll
  );
  const fromBucket = MAP[index - 1];
  const toBucket = MAP[index];
  const relativeScrollInBucket = inverseLerp(
    fromBucket.scroll,
    toBucket.scroll,
    relativeScroll
  );

  const size = lerp(fromBucket.size, toBucket.size, relativeScrollInBucket);
  const offset = lerp(
    fromBucket.offset,
    toBucket.offset,
    relativeScrollInBucket
  );

  console.log(relativeScroll);

  return (
    <div className="App">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}>
        <filter id="f1" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
        <path className="background-path" d={path} />
        <SVGSegment
          className="foreground-path"
          path={path}
          size={size}
          offset={offset}
        />
        {relativeScroll < 1 && (
          <SVGSegment
            className="point-path"
            d={path}
            size={1}
            offset={size + offset}
          />
        )}
      </svg>
    </div>
  );
}

export default App;
