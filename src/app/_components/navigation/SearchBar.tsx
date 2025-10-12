"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import BaseCard from "@/app/_components/cards/BaseCard";
import LoadingSpinner from "@/app/_components/loading/LoadingSpinner";
import searchIcon from "@/assets/icons/search.svg";
import styles from "./SearchBar.module.scss";
import timeline_1 from "@/assets/images/timeline_1.png";

// Hooks
import { useSimpleSearch } from "@/app/_lib/hooks";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className = "",
  placeholder = "Search",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the search hook with automatic debouncing
  const {
    data: searchResponse,
    isLoading: isSearching,
    error,
  } = useSimpleSearch(searchQuery, 400);

  // Extract results from response
  const searchResults = searchResponse?.results || [];

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!searchFocused) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchFocused]);

  return (
    <>
      <AnimatePresence>
        {searchFocused && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={styles.searchBackdrop}
            onClick={() => setSearchFocused(false)}
          />
        )}
      </AnimatePresence>
      <div ref={containerRef} className={`${styles.searchBar} ${className}`}>
        <input
          type="text"
          placeholder={placeholder}
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
        />
        <div className={styles.searchIcon}>
          <Image src={searchIcon} alt="Search Icon" />
        </div>
        <AnimatePresence>
          {searchFocused && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={styles.searchDropdown}
            >
              {isSearching ? (
                <div className={styles.dropdownLoading}>
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className={styles.dropdownError}>
                  {error.message || "Failed to search. Please try again later."}
                </div>
              ) : searchResults.length === 0 ? (
                <div className={styles.dropdownNoResults}>
                  No results found.
                </div>
              ) : (
                <div className={styles.searchDropdownSection}>
                  <h2 className={styles.dropdownSectionTitle}>Results</h2>
                  <div className={styles.searchDropdownMasonry}>
                    {searchResults.map((item) => {
                      // Handle different result types
                      if (item.type === "timeline" || item.type === "topic") {
                        const imageMap: { [key: string]: any } = {
                          "timeline_1.png": timeline_1,
                        };
                        const imageSource = item.image
                          ? imageMap[item.image] || timeline_1
                          : timeline_1;

                        return (
                          <Link
                            href={item.url || `/timeline?id=${item.id}`}
                            key={`${item.type}-${item.id}`}
                          >
                            <BaseCard
                              variant="timeline"
                              layout="compact"
                              image={imageSource}
                              imagePosition="top"
                              showOverlay={false}
                              title={item.title}
                            />
                          </Link>
                        );
                      }

                      // Handle comment results
                      if (item.type === "comment") {
                        return (
                          <Link
                            href={item.url || `/comment/${item.id}`}
                            key={`comment-${item.id}`}
                          >
                            <div className={styles.dropdownCommentItem}>
                              <h4>{item.title}</h4>
                              {item.description && <p>{item.description}</p>}
                            </div>
                          </Link>
                        );
                      }

                      // Handle user results
                      if (item.type === "user") {
                        return (
                          <Link
                            href={item.url || `/profile/${item.id}`}
                            key={`user-${item.id}`}
                          >
                            <div className={styles.dropdownUserItem}>
                              <h4>{item.title}</h4>
                              {item.description && <p>{item.description}</p>}
                            </div>
                          </Link>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default SearchBar;
