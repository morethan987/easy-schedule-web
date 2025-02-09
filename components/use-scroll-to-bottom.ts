import { useEffect, useRef, type RefObject, useState } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (!container || !end) return;

    const observer = new MutationObserver(() => {
      if (shouldAutoScroll) {
        end.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    });

    const handleScroll = () => {
      if (!container) return;

      // 检查是否滚动到底部
      const isAtBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 1;

      // 如果滚动到底部，重新启用自动滚动
      if (isAtBottom) {
        setShouldAutoScroll(true);
      } else {
        // 否则禁用自动滚动
        setShouldAutoScroll(false);
      }
    };

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    // 添加滚动事件监听
    container.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [shouldAutoScroll]);

  return [containerRef, endRef];
}
