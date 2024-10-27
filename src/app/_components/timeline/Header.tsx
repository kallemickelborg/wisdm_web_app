// REWRITE COMPONENT INTO ONE WITH ALL THE OTHERS
'use client';

// System Imports
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAppDispatch, useAppSelector } from '@/src/lib/hooks';
import { updateCurrentChannel } from '@/src/lib/features/userSlice';

// Component Imports
import ThemeToggle from '@/src/app/_components/buttons/ThemeToggle';

// Stylesheet Imports
import styles from '@/app/(pages)/dashboard/timeline/Timeline.module.scss';

// Asset Imports
import arrowLeftBrand from "@/assets/icons/arrow_left_brand.svg";
import questionIcon from '@/assets/icons/questionmark.svg';
import settingsIcon from '@/assets/icons/gear.svg';
import { RootState } from '@/src/lib/store';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state: RootState) => state.user)
  return (
    <header className={styles.header}>
    <div className={styles.timelineHeader}>
      <Link 
        href="/dashboard" 
        className={styles.backButton}
        onClick={() => dispatch(updateCurrentChannel({current_channel: user.username}))}
      >
        <Image src={arrowLeftBrand} alt="Back" />
      </Link>
      <h1 className={styles.pageTitle}>{title}</h1>
      <ThemeToggle />
    </div>
    {/* <div className={styles.iconContainer}>
      <div className={styles.questionIcon}>
        <Image src={questionIcon} alt="Question" />
      </div>
      <div
        className={styles.settingsIcon}
        onClick={() => console.log("toggleSidebar")}
      >
        <Image src={settingsIcon} alt="Settings" />
      </div>
    </div> */}
  </header>
  );
};

export default Header;
