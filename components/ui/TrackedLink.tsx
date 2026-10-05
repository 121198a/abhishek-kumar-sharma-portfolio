"use client";

import React from "react";
import { trackEvent, type PortfolioEvent } from "@/lib/analytics";

type TrackedLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: PortfolioEvent;
};

/** Anchor that records an analytics event on click. Lets parent sections stay server components. */
export default function TrackedLink({ event, onClick, ...rest }: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event);
        onClick?.(e);
      }}
    />
  );
}
