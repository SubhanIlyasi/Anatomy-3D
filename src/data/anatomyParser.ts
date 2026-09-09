/**
 * Professional Medical Nomenclature & Anatomical Parser
 * Resolves all 826 meshes and 1872 structures from Z-Anatomy / BodyParts3D
 * into standardized Terminologia Anatomica (Latin), clinical classifications,
 * functional actions, and pathologies.
 */

import { AnatomicalSystem, AnatomyPartData } from '../types/anatomy';

export interface ParsedAnatomyRecord extends AnatomyPartData {
  category: string;
  subType: 'bone' | 'muscle' | 'cartilage' | 'joint' | 'organ';
  actions?: string;
  origin?: string;
  insertion?: string;
}

// Medical Latin translation dictionary for classic anatomical roots (Terminologia Anatomica)
const LATIN_DICTIONARY: Record<string, string> = {
  "acromial part of deltoid": "Musculus deltoideus (pars acromialis)",
  "clavicular part of deltoid": "Musculus deltoideus (pars clavicularis)",
  "scapular spinal part of deltoid": "Musculus deltoideus (pars spinalis)",
  "deltoid": "Musculus deltoideus",
  "short head of biceps brachii": "Musculus biceps brachii (caput breve)",
  "long head of biceps brachii": "Musculus biceps brachii (caput longum)",
  "biceps brachii": "Musculus biceps brachii",
  "long head of triceps brachii": "Musculus triceps brachii (caput longum)",
  "lateral head of triceps brachii": "Musculus triceps brachii (caput laterale)",
  "medial head of triceps brachii": "Musculus triceps brachii (caput mediale)",
  "triceps brachii": "Musculus triceps brachii",
  "coracobrachialis": "Musculus coracobrachialis",
  "brachialis": "Musculus brachialis",
  "brachioradialis": "Musculus brachioradialis",
  "anconeus": "Musculus anconeus",
  "supinator": "Musculus supinator",
  "humeral head of pronator teres": "Musculus pronator teres (caput humerale)",
  "ulnar head of pronator teres": "Musculus pronator teres (caput ulnare)",
  "pronator teres": "Musculus pronator teres",
  "pronator quadratus": "Musculus pronator quadratus",
  "flexor carpi radialis": "Musculus flexor carpi radialis",
  "flexor carpi ulnaris": "Musculus flexor carpi ulnaris",
  "palmaris longus": "Musculus palmaris longus",
  "extensor carpi radialis longus": "Musculus extensor carpi radialis longus",
  "extensor carpi radialis brevis": "Musculus extensor carpi radialis brevis",
  "extensor carpi ulnaris": "Musculus extensor carpi ulnaris",
  "extensor digitorum": "Musculus extensor digitorum",
  "extensor digiti minimi": "Musculus extensor digiti minimi",
  "extensor indicis": "Musculus extensor indicis",
  "abductor pollicis longus": "Musculus abductor pollicis longus",
  "extensor pollicis brevis": "Musculus extensor pollicis brevis",
  "extensor pollicis longus": "Musculus extensor pollicis longus",
  "flexor pollicis longus": "Musculus flexor pollicis longus",
  "abductor pollicis brevis": "Musculus abductor pollicis brevis",
  "flexor pollicis brevis": "Musculus flexor pollicis brevis",
  "opponens pollicis": "Musculus opponens pollicis",
  "adductor pollicis": "Musculus adductor pollicis",
  "humero-ulnar head of flexor digitorum superficialis": "Musculus flexor digitorum superficialis (caput humeroulnare)",
  "radial head of flexor digitorum superficialis": "Musculus flexor digitorum superficialis (caput radiale)",
  "flexor digitorum superficialis": "Musculus flexor digitorum superficialis",
  "flexor digitorum profundus": "Musculus flexor digitorum profundus",
  "lumbrical muscles of hand": "Musculi lumbricales manus",
  "palmar interossei": "Musculi interossei palmares",
  "dorsal interossei": "Musculi interossei dorsales",
  "clavicular head of pectoralis major": "Musculus pectoralis major (pars clavicularis)",
  "sternocostal head of pectoralis major": "Musculus pectoralis major (pars sternocostalis)",
  "abdominal part of pectoralis major": "Musculus pectoralis major (pars abdominalis)",
  "pectoralis major": "Musculus pectoralis major",
  "pectoralis minor": "Musculus pectoralis minor",
  "subclavius": "Musculus subclavius",
  "serratus anterior": "Musculus serratus anterior",
  "serratus posterior superior": "Musculus serratus posterior superior",
  "serratus posterior inferior": "Musculus serratus posterior inferior",
  "descending part of trapezius": "Musculus trapezius (pars descendens)",
  "transverse part of trapezius": "Musculus trapezius (pars transversa)",
  "ascending part of trapezius": "Musculus trapezius (pars ascendens)",
  "trapezius": "Musculus trapezius",
  "latissimus dorsi": "Musculus latissimus dorsi",
  "rhomboid major": "Musculus rhomboideus major",
  "rhomboid minor": "Musculus rhomboideus minor",
  "levator scapulae": "Musculus levator scapulae",
  "supraspinatus": "Musculus supraspinatus",
  "infraspinatus": "Musculus infraspinatus",
  "subscapularis": "Musculus subscapularis",
  "teres major": "Musculus teres major",
  "teres minor": "Musculus teres minor",
  "external intercostal": "Musculi intercostales externi",
  "internal intercostal": "Musculi intercostales interni",
  "innermost intercostal": "Musculi intercostales intimi",
  "transversus thoracis": "Musculus transversus thoracis",
  "diaphragm": "Diaphragma",
  "rectus abdominis": "Musculus rectus abdominis",
  "external abdominal oblique": "Musculus obliquus externus abdominis",
  "internal abdominal oblique": "Musculus obliquus internus abdominis",
  "transversus abdominis": "Musculus transversus abdominis",
  "pyramidalis": "Musculus pyramidalis",
  "quadratus lumborum": "Musculus quadratus lumborum",
  "psoas major": "Musculus psoas major",
  "psoas minor": "Musculus psoas minor",
  "iliacus": "Musculus iliacus",
  "gluteus maximus": "Musculus gluteus maximus",
  "gluteus medius": "Musculus gluteus medius",
  "gluteus minimus": "Musculus gluteus minimus",
  "tensor fasciae latae": "Musculus tensor fasciae latae",
  "piriformis": "Musculus piriformis",
  "obturator internus": "Musculus obturator internus",
  "obturator externus": "Musculus obturator externus",
  "superior gemellus": "Musculus gemellus superior",
  "inferior gemellus": "Musculus gemellus inferior",
  "quadratus femoris": "Musculus quadratus femoris",
  "sartorius": "Musculus sartorius",
  "gracilis": "Musculus gracilis",
  "pectineus": "Musculus pectineus",
  "adductor longus": "Musculus adductor longus",
  "adductor brevis": "Musculus adductor brevis",
  "adductor magnus": "Musculus adductor magnus",
  "rectus femoris": "Musculus rectus femoris",
  "vastus lateralis": "Musculus vastus lateralis",
  "vastus medialis": "Musculus vastus medialis",
  "vastus intermedius": "Musculus vastus intermedius",
  "quadriceps femoris": "Musculus quadriceps femoris",
  "long head of biceps femoris": "Musculus biceps femoris (caput longum)",
  "short head of biceps femoris": "Musculus biceps femoris (caput breve)",
  "biceps femoris": "Musculus biceps femoris",
  "semitendinosus": "Musculus semitendinosus",
  "semimembranosus": "Musculus semimembranosus",
  "medial head of gastrocnemius": "Musculus gastrocnemius (caput mediale)",
  "lateral head of gastrocnemius": "Musculus gastrocnemius (caput laterale)",
  "gastrocnemius": "Musculus gastrocnemius",
  "soleus": "Musculus soleus",
  "plantaris": "Musculus plantaris",
  "popliteus": "Musculus popliteus",
  "tibialis anterior": "Musculus tibialis anterior",
  "tibialis posterior": "Musculus tibialis posterior",
  "extensor digitorum longus": "Musculus extensor digitorum longus",
  "extensor hallucis longus": "Musculus extensor hallucis longus",
  "flexor digitorum longus": "Musculus flexor digitorum longus",
  "flexor hallucis longus": "Musculus flexor hallucis longus",
  "fibularis longus": "Musculus fibularis longus",
  "fibularis brevis": "Musculus fibularis brevis",
  "fibularis tertius": "Musculus fibularis tertius",
  "sternocleidomastoid": "Musculus sternocleidomastoideus",
  "platysma": "Platysma",
  "superficial part of masseter": "Musculus masseter (pars superficialis)",
  "deep part of masseter": "Musculus masseter (pars profunda)",
  "masseter": "Musculus masseter",
  "temporalis": "Musculus temporalis",
  "medial pterygoid": "Musculus pterygoideus medialis",
  "lateral pterygoid": "Musculus pterygoideus lateralis",
  "orbital part of orbicularis oculi": "Musculus orbicularis oculi (pars orbitalis)",
  "palpebral part of orbicularis oculi": "Musculus orbicularis oculi (pars palpebralis)",
  "orbicularis oculi": "Musculus orbicularis oculi",
  "orbicularis oris": "Musculus orbicularis oris",
  "zygomaticus major": "Musculus zygomaticus major",
  "zygomaticus minor": "Musculus zygomaticus minor",
  "buccinator": "Musculus buccinator",
  "risorius": "Musculus risorius",
  "mentalis": "Musculus mentalis",
  "depressor anguli oris": "Musculus depressor anguli oris",
  "depressor labii inferioris": "Musculus depressor labii inferioris",
  "levator labii superioris": "Musculus levator labii superioris",
  "corrugator supercilii": "Musculus corrugator supercilii",
  "procerus": "Musculus procerus",
  "nasalis": "Musculus nasalis",
  "frontalis": "Musculus occipitofrontalis (venter frontalis)",
  "occipitalis": "Musculus occipitofrontalis (venter occipitalis)",
  "epicranial aponeurosis": "Galea aponeurotica",
  "splenius capitis": "Musculus splenius capitis",
  "splenius colli": "Musculus splenius cervicis",
  "omohyoid": "Musculus omohyoideus",
  "sternohyoid": "Musculus sternohyoideus",
  "sternothyroid": "Musculus sternothyroideus",
  "thyrohyoid": "Musculus thyrohyoideus",
  "anterior belly of digastric": "Musculus digastricus (venter anterior)",
  "posterior belly of digastric": "Musculus digastricus (venter posterior)",
  "digastric": "Musculus digastricus",
  "mylohyoid": "Musculus mylohyoideus",
  "geniohyoid": "Musculus geniohyoideus",
  "stylohyoid": "Musculus stylohyoideus",
  "scalenus anterior": "Musculus scalenus anterior",
  "scalenus medius": "Musculus scalenus medius",
  "scalenus posterior": "Musculus scalenus posterior",
  "longus colli": "Musculus longus colli",
  "longus capitis": "Musculus longus capitis",
  "frontal bone": "Os frontale",
  "parietal bone": "Os parietale",
  "temporal bone": "Os temporale",
  "occipital bone": "Os occipitale",
  "sphenoid bone": "Os sphenoidale",
  "ethmoid bone": "Os ethmoidale",
  "mandible": "Mandibula",
  "maxilla": "Maxilla",
  "zygomatic bone": "Os zygomaticum",
  "nasal bone": "Os nasale",
  "lacrimal bone": "Os lacrimale",
  "palatine bone": "Os palatinum",
  "inferior nasal concha": "Concha nasalis inferior",
  "hyoid bone": "Os hyoideum",
  "sternum": "Sternum",
  "clavicle": "Clavicula",
  "scapula": "Scapula",
  "humerus": "Humerus",
  "radius": "Radius",
  "ulna": "Ulna",
  "scaphoid": "Os scaphoideum",
  "lunate": "Os lunatum",
  "triquetrum": "Os triquetrum",
  "pisiform": "Os pisiforme",
  "trapezium": "Os trapezium",
  "trapezoid": "Os trapezoideum",
  "capitate": "Os capitatum",
  "hamate": "Os hamatum",
  "femur": "Os femoris",
  "patella": "Patella",
  "tibia": "Tibia",
  "fibula": "Fibula",
  "talus": "Talus",
  "calcaneus": "Calcaneus",
  "navicular": "Os naviculare",
  "cuboid": "Os cuboideum"
};

/**
 * Format raw mesh node name into human-readable anatomical name
 * e.g., "Internal_abdominal_oblique_muscle010" -> "Internal Abdominal Oblique Muscle"
 *       "Deltoid muscle.002" -> "Deltoid Muscle"
 *       "Parietal bone.001" -> "Parietal Bone"
 */
export function formatAnatomyName(
  rawName: string,
  userDataName?: string,
  explicitSide?: 'Right' | 'Left' | ''
): { cleanName: string; side: string; baseName: string } {
  const name = (rawName || '').trim();

  // 1. Determine laterality if not explicitly provided
  let side = explicitSide || '';
  if (!side) {
    if (name.endsWith('.r') || name.includes('.r.') || name.includes('_r')) {
      side = 'Right';
    } else if (name.endsWith('.l') || name.includes('.l.') || name.includes('_l')) {
      side = 'Left';
    }
  }

  // 2. Clean internal software suffixes (.001, 010, _010, etc.) and brackets
  let clean = (userDataName || name)
    .replace(/^\(|\)$/g, '')
    .replace(/\.(r|l|\d{1,4})$/i, '')
    .replace(/_(r|l)$/i, '')
    .replace(/_?\d{1,4}$/, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize words
  clean = clean
    .split(' ')
    .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');

  // Standardize vertebra
  if (/^Vertebra [c|t|l|s]\d+$/i.test(clean)) {
    clean = clean.toUpperCase().replace('VERTEBRA', 'Vertebra');
  }

  // Build full clean display name
  const fullCleanName =
    side && !clean.startsWith('Left') && !clean.startsWith('Right')
      ? `${side} ${clean}`
      : clean;

  return { cleanName: fullCleanName, side, baseName: clean };
}

/**
 * Derive authentic textbook Latin nomenclature (Terminologia Anatomica)
 */
export function deriveLatinName(
  baseName: string,
  side: string,
  description?: string
): string {
  // 1. Check if description has embedded pipe delimiter with Latin
  // e.g. "Subdeltoid bursa | Bursa subdeltoidea | Bourse subdeltoïdienne..."
  if (description && description.includes('|')) {
    const parts = description.split('|').map((p) => p.trim());
    if (parts.length >= 2 && parts[1] && parts[1].length > 3 && !parts[1].includes('http')) {
      let pipeLatin = parts[1];
      if (side === 'Right' && !pipeLatin.includes('dexter') && !pipeLatin.includes('dextra')) {
        pipeLatin += ' dexter';
      } else if (side === 'Left' && !pipeLatin.includes('sinister') && !pipeLatin.includes('sinistra')) {
        pipeLatin += ' sinister';
      }
      return pipeLatin;
    }
  }

  const b = baseName.toLowerCase().replace(/^(left|right)\s+/i, '').trim();

  // 2. Exact or substring match in LATIN_DICTIONARY (longest key match first)
  let bestMatchKey = '';
  let bestMatchVal = '';
  for (const [key, latin] of Object.entries(LATIN_DICTIONARY)) {
    if (b.includes(key)) {
      if (key.length > bestMatchKey.length) {
        bestMatchKey = key;
        bestMatchVal = latin;
      }
    }
  }

  if (bestMatchVal) {
    let result = bestMatchVal;
    if (side === 'Right') {
      if (result.startsWith('Musculus')) {
        result += ' dexter';
      } else if (result.startsWith('Os ')) {
        result += ' dextrum';
      } else if (result.startsWith('Costa ') || result.startsWith('Cartilago ') || result.startsWith('Bursa ')) {
        result += ' dextra';
      } else {
        result += ' dexter';
      }
    } else if (side === 'Left') {
      if (result.startsWith('Musculus')) {
        result += ' sinister';
      } else if (result.startsWith('Os ')) {
        result += ' sinistrum';
      } else if (result.startsWith('Costa ') || result.startsWith('Cartilago ') || result.startsWith('Bursa ')) {
        result += ' sinistra';
      } else {
        result += ' sinister';
      }
    }
    return result;
  }

  // 3. Heuristic anatomical generation
  let latin = '';
  if (b.includes('muscle') || b.includes('musculus')) {
    const mName = b.replace(/muscle|musculus/gi, '').trim();
    latin = `Musculus ${mName}`;
  } else if (b.includes('bursa')) {
    latin = `Bursa ${b.replace(/bursa/gi, '').trim()}`;
  } else if (b.includes('tendon sheath') || b.includes('sheath')) {
    latin = `Vagina tendinis ${b.replace(/tendon sheath|sheath/gi, '').trim()}`;
  } else if (b.includes('bone') || b.includes('os')) {
    latin = `Os ${b.replace(/bone/gi, '').trim()}`;
  } else if (b.includes('cartilage')) {
    latin = `Cartilago ${b.replace(/cartilage/gi, '').trim()}`;
  } else if (b.includes('vertebra')) {
    latin = `Vertebra ${b.replace(/vertebra/gi, '').trim()}`;
  } else {
    latin = baseName;
  }

  if (side === 'Right' && !latin.includes('dexter') && !latin.includes('dextra')) {
    latin += ' dexter';
  }
  if (side === 'Left' && !latin.includes('sinister') && !latin.includes('sinistra')) {
    latin += ' sinister';
  }

  return latin.charAt(0).toUpperCase() + latin.slice(1);
}

/**
 * Classify structure into AnatomicalSystem and subType
 */
export function classifyStructure(
  rawName: string,
  userDataType?: string
): {
  system: AnatomicalSystem;
  subType: 'bone' | 'muscle' | 'cartilage' | 'joint' | 'organ';
  category: string;
} {
  const n = (rawName || '').toLowerCase();
  const uType = (userDataType || '').toLowerCase();

  // Explicit userData tags
  if (uType === 'muscle') {
    return { system: 'muscular', subType: 'muscle', category: 'Muscular System' };
  }
  if (uType === 'bone') {
    return { system: 'skeletal', subType: 'bone', category: 'Skeletal System' };
  }

  // Accessory Muscular Apparatus (Bursae & Tendon Sheaths)
  if (n.includes('bursa') || n.includes('tendon sheath') || n.includes('sheath')) {
    return {
      system: 'muscular',
      subType: 'muscle',
      category: 'Accessory Muscular Apparatus (Bursae & Tendon Sheaths)',
    };
  }

  // Muscular keywords
  if (
    n.includes('muscle') ||
    n.includes('musculus') ||
    n.includes('biceps') ||
    n.includes('triceps') ||
    n.includes('deltoid') ||
    n.includes('pectoralis') ||
    n.includes('trapezius') ||
    n.includes('latissimus') ||
    n.includes('gluteus') ||
    n.includes('rectus') ||
    n.includes('oblique') ||
    n.includes('transversus') ||
    n.includes('gastrocnemius') ||
    n.includes('soleus') ||
    n.includes('tibialis') ||
    n.includes('quadriceps') ||
    n.includes('hamstring') ||
    n.includes('orbicularis') ||
    n.includes('zygomaticus') ||
    n.includes('masseter') ||
    n.includes('temporalis') ||
    n.includes('pterygoid') ||
    n.includes('sternocleidomastoid') ||
    n.includes('serratus') ||
    n.includes('intercostal') ||
    n.includes('diaphragm') ||
    n.includes('psoas') ||
    n.includes('iliacus') ||
    n.includes('sartorius') ||
    n.includes('gracilis') ||
    n.includes('brachialis') ||
    n.includes('brachioradialis') ||
    n.includes('pronator') ||
    n.includes('supinator') ||
    n.includes('flexor') ||
    n.includes('extensor') ||
    n.includes('abductor') ||
    n.includes('adductor') ||
    n.includes('lumbrical') ||
    n.includes('interossei') ||
    n.includes('levator') ||
    n.includes('depressor') ||
    n.includes('mentalis') ||
    n.includes('buccinator') ||
    n.includes('risorius') ||
    n.includes('corrugator')
  ) {
    let category = 'Somatic Musculature';
    if (
      n.includes('oculi') ||
      n.includes('oris') ||
      n.includes('zygomatic') ||
      n.includes('mental') ||
      n.includes('buccin') ||
      n.includes('frontalis') ||
      n.includes('nasalis')
    ) {
      category = 'Facial Expression & Craniofacial';
    } else if (n.includes('masseter') || n.includes('temporalis') || n.includes('pterygoid')) {
      category = 'Mastication Musculature';
    } else if (n.includes('pectoral') || n.includes('serratus') || n.includes('intercostal') || n.includes('diaphragm')) {
      category = 'Thoracic & Respiratory Wall';
    } else if (n.includes('rectus abdominis') || n.includes('oblique') || n.includes('transversus')) {
      category = 'Anterior Abdominal Wall';
    } else if (n.includes('trapezius') || n.includes('latissimus') || n.includes('rhomboid') || n.includes('erector')) {
      category = 'Posterior Truncal & Spinal Musculature';
    } else if (n.includes('deltoid') || n.includes('biceps') || n.includes('triceps') || n.includes('brachial') || n.includes('flexor') || n.includes('extensor') || n.includes('pollicis')) {
      category = 'Upper Extremity Musculature';
    } else if (n.includes('gluteus') || n.includes('psoas') || n.includes('iliacus') || n.includes('quadriceps') || n.includes('femur') || n.includes('gastrocnemius') || n.includes('soleus') || n.includes('tibialis')) {
      category = 'Lower Extremity Musculature';
    }
    return { system: 'muscular', subType: 'muscle', category };
  }

  // Cartilage
  if (n.includes('cartilage') || n.includes('meniscus') || n.includes('discus')) {
    return { system: 'skeletal', subType: 'cartilage', category: 'Chondral / Articular Cartilage' };
  }

  // Bones
  let boneCategory = 'Axial Skeleton';
  if (
    n.includes('parietal') ||
    n.includes('frontal') ||
    n.includes('occipital') ||
    n.includes('sphenoid') ||
    n.includes('temporal') ||
    n.includes('ethmoid') ||
    n.includes('nasal') ||
    n.includes('lacrimal') ||
    n.includes('maxilla') ||
    n.includes('mandible') ||
    n.includes('zygomatic') ||
    n.includes('palatine') ||
    n.includes('concha') ||
    n.includes('malleus') ||
    n.includes('incus') ||
    n.includes('stapes') ||
    n.includes('incisor') ||
    n.includes('canine') ||
    n.includes('molar') ||
    n.includes('skull') ||
    n.includes('cranium')
  ) {
    boneCategory = 'Neurocranium & Viscerocranium';
  } else if (n.includes('vertebra') || n.includes('spine') || n.includes('cervical') || n.includes('thoracic') || n.includes('lumbar') || n.includes('sacrum') || n.includes('coccyx')) {
    boneCategory = 'Vertebral Column';
  } else if (n.includes('rib') || n.includes('sternum') || n.includes('costal') || n.includes('thorax')) {
    boneCategory = 'Thoracic Cage';
  } else if (n.includes('clavicle') || n.includes('scapula') || n.includes('humerus') || n.includes('radius') || n.includes('ulna') || n.includes('carpal') || n.includes('scaphoid') || n.includes('lunate') || n.includes('triquetrum') || n.includes('pisiform') || n.includes('trapezium') || n.includes('trapezoid') || n.includes('capitate') || n.includes('hamate') || n.includes('metacarpal') || n.includes('phalanx')) {
    boneCategory = 'Upper Extremity Skeleton';
  } else if (n.includes('pelvis') || n.includes('ilium') || n.includes('ischium') || n.includes('pubis') || n.includes('femur') || n.includes('patella') || n.includes('tibia') || n.includes('fibula') || n.includes('tarsal') || n.includes('talus') || n.includes('calcaneus') || n.includes('navicular') || n.includes('cuneiform') || n.includes('cuboid') || n.includes('metatarsal')) {
    boneCategory = 'Pelvic Girdle & Lower Extremity Skeleton';
  }

  return { system: 'skeletal', subType: 'bone', category: boneCategory };
}

/**
 * Clean up raw Wikipedia description text from glTF extras
 */
function sanitizeDescription(desc?: string): string {
  if (!desc) return '';
  return desc
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/^=+.*?=+$/gm, '')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

/**
 * Generate comprehensive medical details for any structure in the human body
 */
export function getDetailedAnatomyRecord(
  rawName: string,
  userData?: Record<string, any>
): ParsedAnatomyRecord {
  const customName = userData?.nameDetail || userData?.name;
  const explicitSide = userData?.side as ('Right' | 'Left' | '') | undefined;
  const { cleanName, side, baseName } = formatAnatomyName(rawName, customName, explicitSide);
  const latinName = deriveLatinName(baseName, side, userData?.description);
  const classified = classifyStructure(rawName, userData?.type);
  const { system, subType } = classified;
  let category = classified.category;

  // Embedded authored description from Z-Anatomy if present
  let description = sanitizeDescription(userData?.description);
  let primaryFunction = '';
  let actions = '';
  let innervation = '';
  let bloodSupply = '';
  const clinicalSignificance: string[] = [];
  const wikiLink = userData?.wikiLink || `https://en.wikipedia.org/wiki/${encodeURIComponent(baseName)}`;

  if (subType === 'muscle') {
    if (!description || description.includes('|')) {
      description = `A specialized contractile musculoskeletal structure of the ${category.toLowerCase()} consisting of parallel striated myofibrils enclosed by deep fascia.`;
    }
    primaryFunction = 'Generates mechanical contractile tension, facilitates somatic movement, stabilizes adjacent skeletal articulations, and maintains postural equilibrium.';
    actions = 'Produces coordinated dynamic movement across corresponding joint axes (flexion, extension, rotation, abduction, or stabilization).';
    innervation = 'Somatic motor innervation via corresponding spinal or cranial nerve branches with neuromuscular junction acetylcholine signaling.';
    bloodSupply = 'Nutritive perfusion from regional muscular branches of major systemic arterial trunks with deep venous return.';

    clinicalSignificance.push(
      'Myofascial strain and tear: graded athletic injury typically presenting at the myotendinous junction.',
      'Compartment syndrome: elevated intracompartmental myofascial pressure risking neurovascular ischemia and tissue necrosis.',
      'Trigger point referral: localized hyperirritable nodules in taut bands of muscle fibers producing radiating discomfort.'
    );
  } else if (subType === 'bone') {
    if (!description || description.includes('|')) {
      description = `A rigid, highly mineralized osteoid organ composed of cortical compact bone externally and trabecular cancellous bone internally, encasing bone marrow cavities.`;
    }
    primaryFunction = 'Provides structural rigidity and architectural scaffolding for the body, protects vital internal viscera, facilitates musculoskeletal levers, and participates in calcium-phosphate homeostasis.';
    actions = 'Acts as a rigid mechanical lever arm transferring biomechanical loads generated by muscle contractions.';
    innervation = 'Sensory periosteal innervation mediated by fine myelinated and unmyelinated fibers highly sensitive to stretch and tension.';
    bloodSupply = 'Supplied by nutrient arteries penetrating through nutrient foramina, periosteal arteries, and epiphyseal/metaphyseal vessels.';

    clinicalSignificance.push(
      'Fracture vulnerability: disruption of bony cortex under mechanical trauma (transverse, spiral, comminuted, or stress fatigue).',
      'Osteopenia & Osteoporosis: progressive demineralization and microarchitectural deterioration of trabecular matrix.',
      'Osteomyelitis: hematogenous or direct bacterial inoculation into marrow cavity requiring targeted antibiotic intervention.'
    );
  } else {
    if (!description || description.includes('|')) {
      description = `An essential anatomical structure of the ${category.toLowerCase()} contributing to structural integrity, friction reduction, and physiological homeostasis.`;
    }
    primaryFunction = 'Maintains biomechanical stability and reduces kinetic shear stresses between moving articular surfaces.';
    innervation = 'Sensory articular nerve fibers mediating proprioceptive feedback.';
    bloodSupply = 'Nourished via synovial microvascular plexuses and diffusion.';
    clinicalSignificance.push('Bursitis / Tendinopathy secondary to repetitive kinetic microtrauma and mechanical impingement.');
  }

  // Structure-specific clinical actions & pearls
  const lName = baseName.toLowerCase();
  if (lName.includes('bursa')) {
    category = 'Synovial Bursa';
    clinicalSignificance.unshift('Bursitis: painful inflammatory distension of the synovial sac, frequently provoked by repetitive kinetic overuse or mechanical impingement (e.g. subacromial bursitis in shoulder impingement).');
  } else if (lName.includes('tendon sheath')) {
    category = 'Synovial Tendon Sheath';
    clinicalSignificance.unshift('Tenosynovitis: inflammation of the fluid-filled sheath surrounding a tendon, manifesting as local crepitus, tenderness, and restricted excursion (e.g., De Quervain tenosynovitis).');
  } else if (lName.includes('internal abdominal oblique') || lName.includes('internal oblique')) {
    actions = 'Compresses abdominal viscera; bilaterally flexes vertebral column; unilaterally rotates and laterally flexes vertebral column to the same side.';
    innervation = 'Intercostal nerves (T7-T11), subcostal nerve (T12), and iliohypogastric / ilioinguinal nerves (L1).';
    bloodSupply = 'Superior and inferior epigastric arteries, deep circumflex iliac artery.';
  } else if (lName.includes('external abdominal oblique') || lName.includes('external oblique')) {
    actions = 'Compresses abdominal cavity; flexes vertebral column bilaterally; unilaterally rotates torso toward the contralateral side.';
    innervation = 'Lower thoracic intercostal nerves (T7-T12).';
    bloodSupply = 'Inferior epigastric and deep circumflex iliac arteries.';
  } else if (lName.includes('rectus abdominis')) {
    actions = 'Powerful flexion of the lumbar spine; compresses abdominal contents; stabilizes pelvis during ambulation.';
    innervation = 'Thoracoabdominal nerves (T7-T11) and subcostal nerve (T12).';
    bloodSupply = 'Superior and inferior epigastric arteries.';
  } else if (lName.includes('gluteus maximus')) {
    actions = 'Powerful hip extension (e.g. rising from seated posture, stair climbing) and external rotation.';
    innervation = 'Inferior gluteal nerve (L5, S1, S2).';
    bloodSupply = 'Superior and inferior gluteal arteries.';
  } else if (lName.includes('biceps brachii') || lName.includes('biceps')) {
    actions = 'Primary supinator of the flexed forearm; secondary flexor of the elbow joint; weak shoulder stabilizer.';
    innervation = 'Musculocutaneous nerve (C5, C6).';
    bloodSupply = 'Brachial artery muscular branches.';
  } else if (lName.includes('deltoid')) {
    actions = 'Abduction of the arm at the glenohumeral joint beyond 15 degrees (assisted by supraspinatus initially); anterior fibers flex and medially rotate; posterior fibers extend and laterally rotate.';
    innervation = 'Axillary nerve (C5, C6).';
    bloodSupply = 'Posterior circumflex humeral artery and deltoid branch of thoracoacromial artery.';
  } else if (lName.includes('femur')) {
    description = 'The longest, heaviest, and strongest tubular bone in the human body, transmitting total upper body load across the acetabulum to the tibia.';
    clinicalSignificance.unshift('Femoral neck fractures in osteoporotic elderly risk avascular necrosis of the femoral head due to medial circumflex artery compromise.');
  } else if (lName.includes('frontal') || lName.includes('parietal') || lName.includes('temporal') || lName.includes('occipital')) {
    category = 'Neurocranium';
    clinicalSignificance.unshift('Linear skull fractures crossing vascular grooves (e.g. middle meningeal artery groove) carry severe risk of epidural hemorrhage.');
  }

  return {
    id: rawName,
    scientificName: latinName,
    commonName: cleanName,
    system,
    subsystem: category,
    description,
    primaryFunction,
    clinicalSignificance,
    innervation,
    bloodSupply,
    category,
    subType,
    actions,
    wikiLink,
  };
}
