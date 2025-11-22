/**
 * MTG Card type definitions
 */

export interface CardFace {
  name?: string;
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  colors?: string[];
  color_indicator?: string[];
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  flavor_text?: string;
  illustration_scale?: number;
  illustration_position?: { x: number; y: number };
  image_uris?: {
    art_crop?: string;
    png?: string;
    border_crop?: string;
  };
  art_variant?: string;
  mdfc_hint?: string;
}

export interface MTGCard {
  id?: string;
  name?: string;
  layout?: string;
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  defense?: string;
  colors?: string[];
  color_identity?: string[];
  color_indicator?: string[];
  card_faces?: CardFace[];
  set?: string;
  set_name?: string;
  rarity?: string;
  frame_effects?: string[];
  border_color?: string;
  promo_types?: string[];
  copyright?: string;
  artist?: string;
  collector_number?: string;
  illustration_scale?: number;
  illustration_position?: { x: number; y: number };
  image_uris?: {
    art_crop?: string;
    png?: string;
    border_crop?: string;
  };
  keywords?: string[];
  produced_mana?: string[];

  // Custom render options
  art_variant?: string;
  mdfc_hint?: string;
  flavor_text?: string;
}

export interface FrameColors {
  left: string;
  right: string;
}

export interface IllustrationPosition {
  x: string;
  y: string;
}

export interface OracleLine {
  text: string;
  is_ability?: boolean;
  is_reminder?: boolean;
}

export interface PlaneswalkerAbility {
  cost: string;
  text: string;
}

export interface SagaChapter {
  number: string;
  text: string;
}

export interface ClassLevel {
  level: string;
  text: string;
  color: string;
  box_color: string;
}

export interface LevelupLevel {
  range: string;
  power: string;
  toughness: string;
  abilities: string;
  color: string;
  box_color: string;
}
