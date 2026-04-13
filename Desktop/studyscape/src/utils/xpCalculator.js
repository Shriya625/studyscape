export const XP_PER_MINUTE = 10;

export const BUILDING_THRESHOLDS = {
  level1: 0,
  level2: 500,
  level3: 2000,
  level4: 5000,
  level5: 10000,
};

export const calculateXP = (secondsStudied) => {
  const minutes = secondsStudied / 60;
  return Math.floor(minutes * XP_PER_MINUTE);
};

export const getBuildingLevel = (totalXP) => {
  if (totalXP >= BUILDING_THRESHOLDS.level5) return 5;
  if (totalXP >= BUILDING_THRESHOLDS.level4) return 4;
  if (totalXP >= BUILDING_THRESHOLDS.level3) return 3;
  if (totalXP >= BUILDING_THRESHOLDS.level2) return 2;
  return 1;
};

export const getXPToNextLevel = (totalXP) => {
  if (totalXP >= BUILDING_THRESHOLDS.level5) return null;
  if (totalXP >= BUILDING_THRESHOLDS.level4)
    return BUILDING_THRESHOLDS.level5 - totalXP;
  if (totalXP >= BUILDING_THRESHOLDS.level3)
    return BUILDING_THRESHOLDS.level4 - totalXP;
  if (totalXP >= BUILDING_THRESHOLDS.level2)
    return BUILDING_THRESHOLDS.level3 - totalXP;
  return BUILDING_THRESHOLDS.level2 - totalXP;
};
