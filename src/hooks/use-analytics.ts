import { useEffect, useCallback } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { envs } from "@/envs";

// Initialize outside of the hook to avoid re-initialization
let initialized = false;

export function useAnalytics() {
  useEffect(() => {
    if (!initialized) {
      amplitude.init(envs.AMPLITUDE_API_KEY, {
        defaultTracking: {
          sessions: true,
          pageViews: true,
          formInteractions: true,
          fileDownloads: true,
        },
      });
      initialized = true;
      console.log("Amplitude initialized");
    }
  }, []);

  const trackEvent = useCallback(
    (eventName: string, eventProperties?: Record<string, any>) => {
      try {
        amplitude.track(eventName, eventProperties);
        console.log(`Event tracked: ${eventName}`, eventProperties);
      } catch (error) {
        console.error("Error tracking event:", error);
      }
    },
    []
  );

  return { trackEvent };
}
