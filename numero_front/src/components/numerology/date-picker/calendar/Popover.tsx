import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { POPOVER } from "./constants";
import { clamp, getViewport } from "./utils";
import type { PopoverProps, Position } from "./types";

function calculatePosition(
popRect: DOMRect,
viewport: ReturnType<typeof getViewport>
): Position {
const minLeft = viewport.offsetLeft + POPOVER.PADDING;
const maxLeft = viewport.offsetLeft + viewport.width - POPOVER.PADDING - popRect.width;

const minTop = viewport.offsetTop + POPOVER.PADDING;
const maxTop = viewport.offsetTop + viewport.height - POPOVER.PADDING - popRect.height;

const centeredLeft = viewport.offsetLeft + viewport.width / 2 - popRect.width / 2;
const centeredTop = viewport.offsetTop + viewport.height / 2 - popRect.height / 2;

const left = clamp(centeredLeft, minLeft, Math.max(minLeft, maxLeft));
const top = clamp(centeredTop, minTop, Math.max(minTop, maxTop));

return { top, left };
}

export const Popover: React.FC<PopoverProps> = ({
isOpen,
onClose,
anchorRef,
children,
className = "",
}) => {
const popoverRef = useRef<HTMLDivElement>(null);
const contentRef = useRef<HTMLDivElement>(null);
const [position, setPosition] = useState<Position | null>(null);
const lastSizeRef = useRef<{ width: number; height: number } | null>(null);

const updatePosition = (forceUpdate: boolean = false) => {
    if (!contentRef.current) return;

    const popRect = contentRef.current.getBoundingClientRect();
    
    const currentSize = { width: popRect.width, height: popRect.height };
    if (!forceUpdate && lastSizeRef.current) {
        const sizeChanged = 
            Math.abs(lastSizeRef.current.width - currentSize.width) > 1 ||
            Math.abs(lastSizeRef.current.height - currentSize.height) > 1;
        if (!sizeChanged) {
            return; 
        }
    }
    lastSizeRef.current = currentSize;

    const viewport = getViewport();
    const position = calculatePosition(popRect, viewport);
    setPosition(position);
};

useLayoutEffect(() => {
    if (!isOpen) {
    setPosition(null);
    lastSizeRef.current = null;
    return;
    }
    lastSizeRef.current = null;
    updatePosition(true);

    const vv = window.visualViewport;

    let resizeRafId: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
        if (resizeRafId !== null) {
            cancelAnimationFrame(resizeRafId);
        }
        resizeRafId = requestAnimationFrame(() => {
            updatePosition();
            resizeRafId = null;
        });
    });
    
    if (contentRef.current) {
        resizeObserver.observe(contentRef.current);
    }
    
    const handleResize = () => {
        lastSizeRef.current = null;
        updatePosition(true);
    };
    
    const handleScroll = () => {
        updatePosition(false);
    };
    
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    vv?.addEventListener("resize", handleResize);
    vv?.addEventListener("scroll", handleScroll);

    return () => {
    if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
    }
    resizeObserver.disconnect();
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("scroll", handleScroll, true);
    vv?.removeEventListener("resize", handleResize);
    vv?.removeEventListener("scroll", handleScroll);
    };
}, [isOpen, anchorRef]);

useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
    if (
        popoverRef.current &&
        anchorRef.current &&
        e.target instanceof Node &&
        !popoverRef.current.contains(e.target) &&
        !anchorRef.current.contains(e.target)
    ) {
        onClose();
    }
    };

    const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEscape);
    };
}, [isOpen, onClose, anchorRef]);

if (!isOpen) return null;

const displayPos = position ?? { top: POPOVER.PADDING, left: POPOVER.PADDING };

return (
    <>
    <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
    />

    <div
        ref={popoverRef}
        className={["fixed z-50", className].join(" ")}
        style={{
        top: `${displayPos.top}px`,
        left: `${displayPos.left}px`,
        maxWidth: `calc(100vw - ${POPOVER.PADDING * 2}px)`,
        maxHeight: `calc(100vh - ${POPOVER.PADDING * 2}px)`,
        }}
        role="dialog"
        aria-modal="true"
    >
        <div ref={contentRef} style={{ overflow: "auto" }}>
        {children}
        </div>
    </div>
    </>
);
};

export default Popover;
