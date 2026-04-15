'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  announceCustomerNavigationStart,
  clearPendingCustomerNavigation,
  customerNavigationStartEvent,
  isInternalCustomerNavigationTarget,
  readPendingCustomerNavigation,
} from '../lib/navigation-progress';

const progressRamp = [
  { delay: 90, value: 18 },
  { delay: 220, value: 36 },
  { delay: 460, value: 58 },
  { delay: 780, value: 74 },
  { delay: 1_160, value: 86 },
] as const;

export function CustomerNavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeKey = `${pathname ?? ''}?${searchParams?.toString() ?? ''}`;
  const [state, setState] = useState<'idle' | 'loading' | 'completing'>('idle');
  const [progress, setProgress] = useState(0);
  const timeoutsRef = useRef<number[]>([]);
  const stateRef = useRef<'idle' | 'loading' | 'completing'>('idle');
  const lastRouteKeyRef = useRef<string | null>(null);

  const clearTimers = useEffectEvent(() => {
    for (const timeoutId of timeoutsRef.current) {
      window.clearTimeout(timeoutId);
    }

    timeoutsRef.current = [];
  });

  const beginProgress = useEffectEvent(() => {
    clearTimers();
    stateRef.current = 'loading';
    setState('loading');
    setProgress((current) => {
      if (current > 12 && current < 88) {
        return current;
      }

      return 12;
    });

    for (const step of progressRamp) {
      const timeoutId = window.setTimeout(() => {
        setProgress((current) => {
          if (stateRef.current !== 'loading') {
            return current;
          }

          return Math.max(current, step.value);
        });
      }, step.delay);
      timeoutsRef.current.push(timeoutId);
    }
  });

  const completeProgress = useEffectEvent((delay = 0) => {
    clearTimers();
    const completionTimeoutId = window.setTimeout(() => {
      stateRef.current = 'completing';
      setState('completing');
      setProgress(100);
      clearPendingCustomerNavigation();

      const resetTimeoutId = window.setTimeout(() => {
        stateRef.current = 'idle';
        setState('idle');
        setProgress(0);
      }, 240);
      timeoutsRef.current.push(resetTimeoutId);
    }, delay);

    timeoutsRef.current.push(completionTimeoutId);
  });

  useEffect(() => {
    const handleNavigationStart = () => {
      beginProgress();
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target =
        event.target instanceof Element
          ? event.target.closest('a[href]')
          : null;
      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }

      if (target.target && target.target !== '_self') {
        return;
      }

      if (
        target.hasAttribute('download') ||
        !target.href ||
        !isInternalCustomerNavigationTarget(target.href)
      ) {
        return;
      }

      announceCustomerNavigationStart(target.href);
    };

    const handlePopState = () => {
      announceCustomerNavigationStart(window.location.href);
    };

    window.addEventListener(
      customerNavigationStartEvent,
      handleNavigationStart as EventListener,
    );
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      window.removeEventListener(
        customerNavigationStartEvent,
        handleNavigationStart as EventListener,
      );
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleDocumentClick, true);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (lastRouteKeyRef.current === null) {
      lastRouteKeyRef.current = routeKey;

      if (readPendingCustomerNavigation()) {
        beginProgress();
        completeProgress(180);
      }

      return;
    }

    if (lastRouteKeyRef.current !== routeKey) {
      lastRouteKeyRef.current = routeKey;

      if (stateRef.current !== 'idle' || readPendingCustomerNavigation()) {
        completeProgress(120);
      }
    }
  }, [routeKey]);

  return (
    <div
      className="elite-route-progress"
      data-state={state}
      aria-hidden={state === 'idle'}
      role={state === 'idle' ? undefined : 'status'}
      aria-label={state === 'idle' ? undefined : 'Page navigation in progress'}
    >
      <div className="elite-route-progress-track" />
      <div
        className="elite-route-progress-bar"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
      <div
        className="elite-route-progress-glow"
        style={{ transform: `translateX(${Math.max(progress - 8, 0)}%)` }}
      />
    </div>
  );
}
