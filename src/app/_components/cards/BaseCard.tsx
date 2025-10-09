import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { BaseCardProps } from "./types";
import styles from "./BaseCard.module.scss";

// Asset Imports
import upvoteIcon from "@/assets/icons/upvote.svg";
import commentIcon from "@/assets/icons/comment.svg";

/**
 * BaseCard - Reusable card component with variant support
 *
 * Supports multiple card types through variant system:
 * - activity: Content card with voting and comments
 * - notification: Alert-style card with action icon
 * - topic: Image card with overlay and metadata
 * - timeline: Image card with title overlay
 * - source: Background image card with metadata
 * - explore: Image wrapper card for carousel/grid display
 * - vote: Interactive voting card with state machine
 * - comment: Comment card with user avatar and voting
 *
 * @example
 * <BaseCard
 *   variant="activity"
 *   title="Discussion Topic"
 *   content="Card content here"
 *   metadata={{ upvotes: 10, comments: 5 }}
 * />
 */
const BaseCard: React.FC<BaseCardProps> = ({
  variant = "activity",
  layout = "default",
  image,
  imagePosition = "top",
  showOverlay = false,
  title,
  subtitle,
  content,
  metadata,
  footer,
  onClick,
  actionIcon,
  className = "",
  animate = false,
  children,
}) => {
  // Determine if card should be clickable
  const isClickable = !!onClick;

  // Build class names
  const cardClasses = [
    styles.baseCard,
    styles[`layout${layout.charAt(0).toUpperCase() + layout.slice(1)}`],
    styles[`variant${variant.charAt(0).toUpperCase() + variant.slice(1)}`],
    isClickable ? styles.clickable : "",
    animate ? styles.animate : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Container component (motion.div for animation, div otherwise)
  const Container = animate ? motion.div : "div";
  const containerProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.3,
          type: "tween",
          ease: "easeOut",
        },
      }
    : {};

  // Render image if provided
  const renderImage = () => {
    if (!image) return null;

    const imageClasses = [
      styles.imageContainer,
      imagePosition === "top" ? styles.imageTop : styles.imageBackground,
    ].join(" ");

    return (
      <div className={imageClasses}>
        <Image
          src={image}
          alt={title || "Card image"}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {showOverlay && <div className={styles.overlay} />}
      </div>
    );
  };

  // Render metadata (upvotes, comments, author, etc.)
  const renderMetadata = () => {
    if (!metadata) return null;

    return (
      <div className={styles.metadata}>
        {metadata.upvotes !== undefined && (
          <div className={styles.metadataItem}>
            <Image src={upvoteIcon} alt="Upvote" width={16} height={16} />
            <span>{metadata.upvotes}</span>
          </div>
        )}
        {metadata.comments !== undefined && (
          <div className={styles.metadataItem}>
            <Image src={commentIcon} alt="Comment" width={16} height={16} />
            <span>{metadata.comments} comments</span>
          </div>
        )}
        {metadata.author && (
          <div className={styles.metadataItem}>
            <span>{metadata.author}</span>
          </div>
        )}
        {metadata.publication && (
          <div className={styles.metadataItem}>
            <span>{metadata.publication}</span>
          </div>
        )}
        {metadata.date && (
          <div className={styles.metadataItem}>
            <span>{metadata.date}</span>
          </div>
        )}
        {metadata.username && (
          <div className={styles.metadataItem}>
            <span>{metadata.username}</span>
          </div>
        )}
        {metadata.time && (
          <div className={styles.metadataItem}>
            <span>{metadata.time}</span>
          </div>
        )}
      </div>
    );
  };

  // Render footer
  const renderFooter = () => {
    if (!footer && !metadata) return null;

    return (
      <div className={styles.cardFooter}>
        {renderMetadata()}
        {footer}
      </div>
    );
  };

  return (
    <Container className={cardClasses} onClick={onClick} {...containerProps}>
      {/* Image (background or top) */}
      {imagePosition === "background" && renderImage()}

      {/* Image (top position) */}
      {imagePosition === "top" && renderImage()}

      {/* Content */}
      <div className={styles.cardContent}>
        {/* Header */}
        {(title || subtitle || actionIcon) && (
          <div className={styles.cardHeader}>
            <div>
              {title && <h3 className={styles.cardTitle}>{title}</h3>}
              {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
            </div>
            {actionIcon && (
              <div className={styles.actionIcon}>{actionIcon}</div>
            )}
          </div>
        )}

        {/* Body */}
        {content && (
          <div className={styles.cardBody}>
            {typeof content === "string" ? <p>{content}</p> : content}
          </div>
        )}

        {/* Custom children */}
        {children}
      </div>

      {/* Footer */}
      {renderFooter()}
    </Container>
  );
};

export default BaseCard;
