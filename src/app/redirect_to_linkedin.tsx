"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ExternalLink } from "lucide-react";

const LINKEDIN_URL = "https://linkedin.com/in/benjaminfshen";
const REDIRECT_SECONDS = 5;
const UPDATE_INTERVAL_MS = 20;

interface RedirectToLinkedInProps {
  isPressed: boolean;
  onRedirectStart?: () => void;
  onRedirectComplete?: () => void;
}

const RedirectToLinkedIn: React.FC<RedirectToLinkedInProps> = ({
  isPressed,
  onRedirectStart,
  onRedirectComplete,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const [isVisible, setIsVisible] = useState(false);
  const hasRedirected = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>(null);
  const redirectRef = useRef<NodeJS.Timeout>(null);

  const handleRedirect = useCallback(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      const currentPath = window.location.pathname;
      window.history.pushState({}, "", currentPath);
      window.location.href = LINKEDIN_URL;
      onRedirectComplete?.();
    }
  }, [onRedirectComplete]);

  useEffect(() => {
    setIsVisible(true);

    if (!isPressed) {
      onRedirectStart?.();
      const remainingTimeMs = secondsLeft * 1000;

      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          const newValue = Math.max(0, prev - UPDATE_INTERVAL_MS / 1000);
          return Number(newValue.toFixed(2)); // Prevent floating point errors
        });
      }, UPDATE_INTERVAL_MS);

      redirectRef.current = setTimeout(handleRedirect, remainingTimeMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
      }
    };
  }, [isPressed, secondsLeft, handleRedirect, onRedirectStart]);

  const progressPercentage =
    ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * 100;

  return (
    <div
      className="flex flex-col items-center justify-center text-white transition-opacity duration-1000 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }}
      role="alert"
      aria-live="polite"
    >
      <div className="text-center space-y-6 h-2">
        <div className="flex items-center justify-center space-x-2">
          <p className="font-bold">
            {isPressed
              ? "Nothing to see here... yet!"
              : "Redirecting to LinkedIn"}
          </p>
          {!isPressed && (
            <a
              href={LINKEDIN_URL}
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 transition-colors inline-flex items-center"
              aria-label="Open LinkedIn profile in new tab"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
        {!isPressed && (
          <div
            className="w-64 h-1 bg-white/30 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercentage}
          >
            <div
              className="h-full bg-white rounded-full transition-all duration-20 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RedirectToLinkedIn;
