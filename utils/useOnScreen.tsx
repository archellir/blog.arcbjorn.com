import { Ref, useCallback, useState } from "preact/hooks";

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
  const [observer, setOserver] = useState<IntersectionObserver>();
  const [isIntersecting, setIntersecting] = useState(false);

  const measureRef = useCallback(
    (node: Element) => {
      if (node) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            setIntersecting(entry.isIntersecting);
          },
          { root, rootMargin, threshold },
        );

        observer.observe(node);
        setOserver(observer);
      }
    },
    [root, rootMargin, threshold],
  ) as unknown as Ref<HTMLLIElement>;

  return { measureRef, isIntersecting, observer };
};

export default useOnScreen;
