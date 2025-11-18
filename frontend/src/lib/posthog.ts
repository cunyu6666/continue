import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

if (posthogKey && posthogHost) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    loaded: (posthog) => {
      if (import.meta.env.DEV) posthog.debug();
    },
  });
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (posthogKey) {
    posthog.capture(eventName, properties);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (posthogKey) {
    posthog.identify(userId, traits);
  }
};

export { posthog };
