"use client";

// System Imports
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useWebSocketChannel } from "@/app/_contexts/WebSocketChannelContext";
import { standardizePersonalRoomName } from "@/app/_lib/user/name/general";
import { useUserProfile } from "@/app/_lib/hooks";

// API/Database Imports
import type {
  TimelineWithDetails,
  SelectedPopupEvent,
  TimelinePopupProps,
} from "@/models";

// Component Imports
import BaseHeader from "@/app/_components/header";
import Perspectives from "@/app/_components/timeline/Perspectives";
import TimelineEvents from "@/app/_components/timeline/TimelineEvents";
import ThreadContainer from "@/app/_components/comments/ThreadContainer/ThreadContainer";
import TimelinePopup from "@/app/_components/timeline/TimelinePopup";

// Stylesheet Imports
import styles from "@/app/(pages)/(dashboard)/timeline/Timeline.module.scss";

// Assets
import LoadingOverlay from "@/app/_components/loading/LoadingOverlay";
import timeline_1 from "@/assets/images/timeline_1.png";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const Timeline = () => {
  const [timelineData, setTimelineData] = useState<TimelineWithDetails | null>(
    null
  );
  const searchParams = useSearchParams();
  const timelineId: string = searchParams?.get("id") || "";
  const { setCurrentChannel } = useWebSocketChannel();
  const { data: user } = useUserProfile();

  const handleBackClick = () => {
    setCurrentChannel(standardizePersonalRoomName(user?.username || ""));
  };

  // Using the type from the central types file
  const [selectedPopupEvent, setSelectedPopupEvent] =
    useState<SelectedPopupEvent | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeEventElement, setActiveEventElement] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    const fetchTimelineDetails = async () => {
      // Check if timelineId is provided
      if (!timelineId) {
        console.error("No timeline ID provided in URL parameters");
        setTimelineData(null);
        return;
      }

      const TIMELINE_DETAILS_URL = `${API_BASE_URL}/timelines/get/timeline?id=${timelineId}`;
      try {
        const response = await fetch(TIMELINE_DETAILS_URL, {
          method: "GET",
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
          setTimelineData(result);
        } else {
          console.error("Error fetching timeline:", result.error);
          setTimelineData(null);
        }
      } catch (e) {
        console.error(
          `Looks like there was an error fetching your timeline details: ${e}`
        );
        setTimelineData(null);
      }
    };
    fetchTimelineDetails();
  }, [timelineId]);

  useEffect(() => {
    if (timelineId) {
      setCurrentChannel(timelineId);
    }
  }, [timelineId, setCurrentChannel]);

  const customEventClickHandler = (event: any, e: React.MouseEvent) => {
    const eventElement = e.currentTarget as HTMLElement;

    if (activeEventElement) {
      activeEventElement.classList.remove(styles.highlightedEvent);
    }

    eventElement.classList.add(styles.highlightedEvent);
    setActiveEventElement(eventElement);

    const eventIndex = event.event_index;

    const popupEvent = {
      title: event.body.split(":")[1]?.trim() || event.body,
      index: eventIndex,
      eventId: event.id,
    };

    const rect = eventElement.getBoundingClientRect();
    const initialX =
      rect.left + (event.narrative_bias === "left" ? rect.width : 0);
    const initialY = rect.top + rect.height / 2;

    setSelectedPopupEvent({
      event: popupEvent,
      position: { x: initialX, y: initialY },
      bias: event.narrative_bias,
    });

    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    if (activeEventElement) {
      activeEventElement.classList.remove(styles.highlightedEvent);
      setActiveEventElement(null);
    }
    setIsPopupOpen(false);
  };

  // Show error message if no timeline ID is provided
  if (!timelineId) {
    return (
      <div className={styles.timelineContainer}>
        <BaseHeader
          title="Timeline Not Found"
          variant="timeline"
          backButton={{
            href: "/home",
            onClick: handleBackClick,
          }}
        />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>No Timeline ID Provided</h2>
          <p>
            Please navigate to a timeline from the dashboard or search results.
          </p>
        </div>
      </div>
    );
  }

  // Show loading while fetching data
  if (!timelineData) {
    return <LoadingOverlay isVisible={true} />;
  }

  return (
    timelineData && (
      <>
        <div className={styles.timelineContainer}>
          <BaseHeader
            title={timelineData?.timeline.title || "Loading..."}
            variant="timeline"
            backButton={{
              href: "/home",
              onClick: handleBackClick,
            }}
          />
          <div className={styles.timelineImage}>
            <Image src={timeline_1} alt="Timeline Image" />
          </div>
          <Perspectives
            left={{
              title: "Left Perspective",
              content:
                timelineData?.summary?.summary?.substring(0, 150) + "..." ||
                "Add Event Perspective Summaries",
            }}
            right={{
              title: "Right Perspective",
              content:
                timelineData?.summary?.summary?.substring(0, 150) + "..." ||
                "Add Event Perspective Summaries",
            }}
            topicStatement={timelineData?.timeline?.topic_statement}
          />
          <TimelineEvents
            events={timelineData.events}
            onEventClick={customEventClickHandler}
          />

          {selectedPopupEvent && (
            <TimelinePopup
              event={selectedPopupEvent.event}
              isOpen={isPopupOpen}
              onClose={handlePopupClose}
              initialClickPosition={selectedPopupEvent.position}
              narrativeBias={selectedPopupEvent.bias}
              timelineData={timelineData}
            />
          )}
        </div>
        <ThreadContainer threadId={timelineId} threadType="timelines" />
      </>
    )
  );
};

export default Timeline;
