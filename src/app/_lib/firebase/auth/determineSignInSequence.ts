"use client";

import { getDeviceType } from "@/app/_lib/helper/device/getDeviceType";

export const determineSignInSequence = (
  popUpSequence: Function,
  redirectSequence: Function
) => {
  const deviceType = getDeviceType();
  switch (deviceType) {
    case "Mobile":
    case "Tablet":
      redirectSequence();
      break;
    case "Desktop":
      popUpSequence();
      break;
    default:
      popUpSequence();
      break;
  }
};
