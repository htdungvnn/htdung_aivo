/**
 * AIVO Onboarding Options
 * Stable IDs, labels (i18n keys), and compatibility metadata
 */

export interface EquipmentOption {
  id: string;
  labelKey: string; // i18n translation key
  incompatibleWith?: string[]; // IDs that conflict
  isFullAccess?: boolean; // True if this represents full gym access
}

export interface DietPreferenceOption {
  id: string;
  labelKey: string; // i18n translation key
}

export interface AgeRangeOption {
  id: string;
  labelKey: string;
  minAge: number;
  maxAge: number | null; // null for 65+
}

export const equipmentOptions: EquipmentOption[] = [
  {
    id: "no_equipment",
    labelKey: "onboarding.equipment.noEquipment",
    incompatibleWith: ["dumbbells", "resistance_bands", "barbell", "bench", "pullup_bar", "cable_machine", "full_gym"],
  },
  {
    id: "dumbbells",
    labelKey: "onboarding.equipment.dumbbells",
  },
  {
    id: "resistance_bands",
    labelKey: "onboarding.equipment.resistanceBands",
  },
  {
    id: "barbell",
    labelKey: "onboarding.equipment.barbell",
  },
  {
    id: "bench",
    labelKey: "onboarding.equipment.bench",
  },
  {
    id: "pullup_bar",
    labelKey: "onboarding.equipment.pullupBar",
  },
  {
    id: "cable_machine",
    labelKey: "onboarding.equipment.cableMachine",
  },
  {
    id: "full_gym",
    labelKey: "onboarding.equipment.fullGym",
    isFullAccess: true,
  },
];

export const dietPreferenceOptions: DietPreferenceOption[] = [
  { id: "no_preference", labelKey: "onboarding.nutrition.noPreference" },
  { id: "vegetarian", labelKey: "onboarding.nutrition.vegetarian" },
  { id: "vegan", labelKey: "onboarding.nutrition.vegan" },
  { id: "pescatarian", labelKey: "onboarding.nutrition.pescatarian" },
  { id: "high_protein", labelKey: "onboarding.nutrition.highProtein" },
  { id: "low_carb", labelKey: "onboarding.nutrition.lowCarb" },
  { id: "dairy_free", labelKey: "onboarding.nutrition.dairyFree" },
  { id: "gluten_free", labelKey: "onboarding.nutrition.glutenFree" },
];

export const ageRangeOptions: AgeRangeOption[] = [
  { id: "18-25", labelKey: "onboarding.profile.age18_25", minAge: 18, maxAge: 25 },
  { id: "26-35", labelKey: "onboarding.profile.age26_35", minAge: 26, maxAge: 35 },
  { id: "36-45", labelKey: "onboarding.profile.age36_45", minAge: 36, maxAge: 45 },
  { id: "46-55", labelKey: "onboarding.profile.age46_55", minAge: 46, maxAge: 55 },
  { id: "56-65", labelKey: "onboarding.profile.age56_65", minAge: 56, maxAge: 65 },
  { id: "65+", labelKey: "onboarding.profile.age65plus", minAge: 65, maxAge: null },
];

/**
 * Get equipment options compatible with selected IDs
 */
export function getCompatibleEquipment(selectedIds: string[]): string[] {
  if (selectedIds.includes("no_equipment")) {
    return ["no_equipment"];
  }
  if (selectedIds.includes("full_gym")) {
    return equipmentOptions.map((e) => e.id);
  }
  return selectedIds;
}

/**
 * Validate that equipment selection has no conflicts
 */
export function validateEquipmentSelection(selectedIds: string[]): { valid: boolean; conflicts: string[] } {
  const conflicts: string[] = [];
  
  if (selectedIds.includes("no_equipment") && selectedIds.length > 1) {
    conflicts.push("no_equipment");
  }
  
  for (const id of selectedIds) {
    const option = equipmentOptions.find((e) => e.id === id);
    if (option?.incompatibleWith) {
      for (const incompatible of option.incompatibleWith) {
        if (selectedIds.includes(incompatible)) {
          conflicts.push(id, incompatible);
        }
      }
    }
  }
  
  return {
    valid: conflicts.length === 0,
    conflicts: [...new Set(conflicts)],
  };
}
