import { useCallback, useEffect, useState } from "preact/hooks";
import type { Ref } from "preact";

interface IUseOnScreenResult {
  measureRef: Ref<HTMLLIElement>;
  isIntersecting: boolean;
  observer?: IntersectionObserver;
}

const useOnScreen = ({
  root = null,
  rootMargin = "0px",
  threshold = 0,
} = {}): IUseOnScreenResult => {
  const [observer, setObserver] = useState<IntersectionObserver>();
  const [isIntersecting, setIntersecting] = useState(false);

  const measureRef = useCallback(
    (node: Element | null) => {
      if (observer) {
        observer.disconnect();
      }

      if (node) {
        const newObserver = new IntersectionObserver(
          ([entry]) => {
            setIntersecting(entry.isIntersecting);
          },
          { root, rootMargin, threshold },
        );

        newObserver.observe(node);
        setObserver(newObserver);
      }
    },
    [root, rootMargin, threshold],
  ) as unknown as Ref<HTMLLIElement>;

  useEffect(() => {
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer]);

  return { measureRef, isIntersecting, observer };
};

export default useOnScreen;
