/**
 * Medical & Anatomical Type Definitions
 * Interactive 3D Human Anatomy Platform (Professional Edition)
 */

export type AnatomicalSystem =
  | 'skeletal'
  | 'muscular'
  | 'cardiovascular'
  | 'respiratory'
  | 'digestive'
  | 'nervous';

export type RenderMode = 'standard' | 'xray' | 'wireframe';

export interface AnatomicalLandmark {
  name: string;
  description: string;
}

export interface AnatomyPartData {
  id: string; // mesh node name in 3D model
  scientificName: string; // Latin / Terminologia Anatomica designation
  commonName: string; // Clinical English title
  system: AnatomicalSystem;
  subsystem?: string;
  description: string; // Comprehensive anatomical description
  primaryFunction: string;
  clinicalSignificance: string[];
  innervation?: string;
  bloodSupply?: string;
  landmarks?: AnatomicalLandmark[];
  coordinates?: [number, number, number]; // 3D focus center
  color?: string;
  category?: string;
  subType?: 'bone' | 'muscle' | 'cartilage' | 'joint' | 'organ';
  actions?: string;
  origin?: string;
  insertion?: string;
  wikiLink?: string; // Direct link to medical literature / encyclopedic entry
}

export interface SystemMeta {
  id: AnatomicalSystem;
  name: string;
  latinName: string;
  color: string;
  accentColor: string;
  iconName: string;
  description: string;
  organCount: number;
}
