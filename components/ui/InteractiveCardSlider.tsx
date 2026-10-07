"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

export interface InteractiveCardSliderProps<T> {
  items: T[];
  getItemKey: (item: T, index: number) => string;
  renderCard: (item: T, index: number, isSelected: boolean) => React.ReactNode;
  renderDetail: (item: T, index: number, onClose: () => void) => React.ReactNode;
  ariaLabel?: string;
  emptyMessage?: string;
  className?: string;
}

export default function InteractiveCardSlider<T>({
  items,
  getItemKey,
  renderCard,
  renderDetail,
  ariaLabel = "Card carousel",
  emptyMessage = "No items available.",
  className = "",
}: InteractiveCardSliderProps<T>) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const savedScrollLeftRef = useRef<number>(0);

  // Drag interaction refs for touch/mouse pointers
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Monitor horizontal scroll to update active dot index
  const handleScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el || items.length === 0) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 300;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.max(0, Math.min(items.length - 1, index)));
  }, [items.length]);

  // Restore slider scroll position when exiting detail state
  useEffect(() => {
    if (selectedKey === null && sliderRef.current) {
      sliderRef.current.scrollLeft = savedScrollLeftRef.current;
    }
  }, [selectedKey]);

  // Open card detail
  const handleCardClick = (key: string) => {
    if (hasMovedRef.current) {
      // Was a drag gesture, not a click
      return;
    }
    if (sliderRef.current) {
      savedScrollLeftRef.current = sliderRef.current.scrollLeft;
    }
    setSelectedKey(key);
  };

  // Close card detail (< Back button)
  const handleCloseDetail = () => {
    setSelectedKey(null);
  };

  // Pointer / Mouse drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftStartRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = sliderRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    hasMovedRef.current = false;
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-panel2/40 p-8 text-center text-muted text-xs">
        {emptyMessage}
      </div>
    );
  }

  const selectedIndex =
    selectedKey !== null
      ? items.findIndex((item, idx) => getItemKey(item, idx) === selectedKey)
      : -1;
  const selectedItem = selectedIndex !== -1 ? items[selectedIndex] : null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* 
        STATE A: Horizontal Interactive Card Slider
        Shown when no card is actively selected
      */}
      {selectedItem === null ? (
        <div className="space-y-4">
          {/* Slider counter */}
          <div className="flex items-center justify-end px-1 text-xs text-muted">
            <span className="font-mono text-[11px] font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-full border border-purple/20">
              {activeIndex + 1} / {items.length}
            </span>
          </div>

          {/* Slider track with touch/swipe + mouse drag support */}
          <div
            ref={sliderRef}
            role="region"
            aria-label={ariaLabel}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 snap-x snap-mandatory overscroll-x-contain select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-purple"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {items.map((item, index) => {
              const key = getItemKey(item, index);
              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open details for item ${index + 1}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick(key);
                    }
                  }}
                  onClick={() => handleCardClick(key)}
                  className="snap-start shrink-0 w-[82vw] max-w-[320px] cursor-pointer transition-transform duration-200 active:scale-[0.98] group flex flex-col justify-between"
                >
                  <div className="h-full rounded-2xl border border-line bg-panel2/80 p-0 overflow-hidden shadow-lg transition-all duration-300 group-hover:border-purple/50 group-hover:shadow-purple/10">
                    {renderCard(item, index, false)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slider progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {items.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={getItemKey(item, idx)}
                  type="button"
                  onClick={() => {
                    if (sliderRef.current) {
                      const el = sliderRef.current;
                      const cardWidth = el.firstElementChild
                        ? (el.firstElementChild as HTMLElement).offsetWidth + 16
                        : 300;
                      el.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
                    }
                  }}
                  aria-label={`Jump to item ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-6 bg-purple"
                      : "w-1.5 bg-line hover:bg-purple/40"
                  }`}
                />
              );
            })}
          </div>
        </div>
      ) : (
        /* 
          STATE B: Focused / Sticky Detail View
          Shown when a specific card is tapped.
          Displays complete content, scrollable if long, with clear `<` exit control.
        */
        <div className="sticky top-[84px] z-30 rounded-2xl border border-line bg-panel2 shadow-2xl backdrop-blur-2xl transition-all duration-300 overflow-hidden">
          {/* Detail View Header with `<` Exit / Back Control */}
          <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3">
            <button
              type="button"
              onClick={handleCloseDetail}
              aria-label="Exit detail view and return to card slider"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel2 px-3 py-1.5 text-xs font-bold text-ink hover:border-purple/50 hover:text-purple transition-all active:scale-95 shadow-sm"
            >
              <span className="text-purple text-base leading-none font-black">‹</span>
              <span>Back to Slider</span>
            </button>

            {/* Quick Switcher Between Items in Detail View */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted">
                {selectedIndex + 1} of {items.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={selectedIndex <= 0}
                  onClick={() => {
                    const prevItem = items[selectedIndex - 1];
                    if (prevItem) setSelectedKey(getItemKey(prevItem, selectedIndex - 1));
                  }}
                  aria-label="Previous item"
                  className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-panel2 text-xs font-bold text-ink disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple/40 transition-colors"
                >
                  ‹
                </button>
                <button
                  type="button"
                  disabled={selectedIndex >= items.length - 1}
                  onClick={() => {
                    const nextItem = items[selectedIndex + 1];
                    if (nextItem) setSelectedKey(getItemKey(nextItem, selectedIndex + 1));
                  }}
                  aria-label="Next item"
                  className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-panel2 text-xs font-bold text-ink disabled:opacity-30 disabled:cursor-not-allowed hover:border-purple/40 transition-colors"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content Container (Req 3: Long Content Must Be Scrollable) */}
          <div className="max-h-[66vh] overflow-y-auto p-5 overscroll-contain space-y-4">
            {renderDetail(selectedItem, selectedIndex, handleCloseDetail)}
          </div>
        </div>
      )}
    </div>
  );
}
