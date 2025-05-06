
import { useEffect, useCallback } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { envs } from "@/envs";

// Initialize outside of the hook to avoid re-initialization
let initialized = false;

type EventProperties = Record<string, any>;

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
    (eventName: string, eventProperties?: EventProperties) => {
      try {
        amplitude.track(eventName, eventProperties);
        console.log(`Event tracked: ${eventName}`, eventProperties);
      } catch (error) {
        console.error("Error tracking event:", error);
      }
    }, []
  );

  const trackAppointmentEvent = useCallback((action: string, appointmentId?: string, additionalProps?: EventProperties) => {
    trackEvent(`appointment_${action}`, {
      appointment_id: appointmentId,
      ...additionalProps
    });
  }, [trackEvent]);
  
  const trackPatientEvent = useCallback((action: string, patientId?: string, additionalProps?: EventProperties) => {
    trackEvent(`patient_${action}`, {
      patient_id: patientId,
      ...additionalProps
    });
  }, [trackEvent]);
  
  const trackUserEvent = useCallback((action: string, userId?: string, additionalProps?: EventProperties) => {
    trackEvent(`user_${action}`, {
      user_id: userId,
      ...additionalProps
    });
  }, [trackEvent]);

  const trackPageView = useCallback((pageName: string, additionalProps?: EventProperties) => {
    trackEvent('page_view', {
      page_name: pageName,
      ...additionalProps
    });
  }, [trackEvent]);

  const trackButtonClick = useCallback((buttonName: string, additionalProps?: EventProperties) => {
    trackEvent('button_click', {
      button_name: buttonName,
      ...additionalProps
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, formStatus: 'success' | 'error', additionalProps?: EventProperties) => {
    trackEvent('form_submit', {
      form_name: formName,
      status: formStatus,
      ...additionalProps
    });
  }, [trackEvent]);

  const trackDownload = useCallback((fileType: string, fileName: string, additionalProps?: EventProperties) => {
    trackEvent('file_download', {
      file_type: fileType,
      file_name: fileName,
      ...additionalProps
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackAppointmentEvent,
    trackPatientEvent,
    trackUserEvent,
    trackPageView,
    trackButtonClick,
    trackFormSubmit,
    trackDownload
  };
}
