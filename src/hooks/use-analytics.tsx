
import { useEffect, useCallback } from "react";
import * as amplitude from "@amplitude/analytics-browser";
import { envs } from "@/envs";
import { toast } from "@/hooks/use-standardized-toast";

// Initialize outside of the hook to avoid re-initialization
let initialized = false;

type EventProperties = Record<string, any>;

export function useAnalytics() {
  useEffect(() => {
    if (!initialized) {
      try {
        amplitude.init(envs.AMPLITUDE_API_KEY, {
          defaultTracking: {
            sessions: true,
            pageViews: true,
            formInteractions: true,
            fileDownloads: true,
          },
        });
        initialized = true;
        console.log("Amplitude initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Amplitude:", error);
        toast.error("Falha ao inicializar sistema de análise");
      }
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
      timestamp: new Date().toISOString(),
      ...additionalProps
    });
  }, [trackEvent]);

  const trackButtonClick = useCallback((buttonName: string, additionalProps?: EventProperties) => {
    trackEvent('button_click', {
      button_name: buttonName,
      timestamp: new Date().toISOString(),
      ...additionalProps
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, formStatus: 'success' | 'error', additionalProps?: EventProperties) => {
    trackEvent('form_submit', {
      form_name: formName,
      status: formStatus,
      timestamp: new Date().toISOString(),
      ...additionalProps
    });
  }, [trackEvent]);

  const trackDownload = useCallback((fileType: string, fileName: string, additionalProps?: EventProperties) => {
    trackEvent('file_download', {
      file_type: fileType,
      file_name: fileName,
      timestamp: new Date().toISOString(),
      ...additionalProps
    });
  }, [trackEvent]);

  const trackSearch = useCallback((searchTerm: string, searchResults: number, additionalProps?: EventProperties) => {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: searchResults,
      timestamp: new Date().toISOString(),
      ...additionalProps
    });
  }, [trackEvent]);

  const trackFeatureUsage = useCallback((featureName: string, additionalProps?: EventProperties) => {
    trackEvent('feature_usage', {
      feature_name: featureName,
      timestamp: new Date().toISOString(),
      ...additionalProps
    });
  }, [trackEvent]);

  const trackError = useCallback((errorType: string, errorMessage: string, additionalProps?: EventProperties) => {
    trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      timestamp: new Date().toISOString(),
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
    trackDownload,
    trackSearch,
    trackFeatureUsage,
    trackError
  };
}
