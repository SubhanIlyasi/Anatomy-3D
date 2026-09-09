import { AnatomyPartData, SystemMeta } from '../types/anatomy';

export const SYSTEMS_METADATA: Record<string, SystemMeta> = {
  skeletal: {
    id: 'skeletal',
    name: 'Skeletal System',
    latinName: 'Systema skeletale',
    color: '#e2e8f0', // bone slate/white
    accentColor: '#cbd5e1',
    iconName: 'Bone',
    description: 'Provides mechanical framework, protection of internal organs, and mineral homeostasis.',
    organCount: 5,
  },
  cardiovascular: {
    id: 'cardiovascular',
    name: 'Cardiovascular System',
    latinName: 'Systema cardiovasculare',
    color: '#ef4444', // arterial crimson
    accentColor: '#f87171',
    iconName: 'Heart',
    description: 'Circulates blood, delivers oxygen and nutrients, removes metabolic waste products.',
    organCount: 1,
  },
  respiratory: {
    id: 'respiratory',
    name: 'Respiratory System',
    latinName: 'Systema respiratorium',
    color: '#06b6d4', // cyan / pulmonary air
    accentColor: '#22d3ee',
    iconName: 'Wind',
    description: 'Facilitates gas exchange between atmospheric oxygen and systemic carbon dioxide.',
    organCount: 2,
  },
  digestive: {
    id: 'digestive',
    name: 'Digestive System',
    latinName: 'Systema digestorium',
    color: '#f59e0b', // amber / metabolic
    accentColor: '#fbbf24',
    iconName: 'Utensils',
    description: 'Ingests, digests nutrients, synthesizes bile, and regulates metabolic energy reserves.',
    organCount: 3,
  },
  nervous: {
    id: 'nervous',
    name: 'Nervous System',
    latinName: 'Systema nervosum',
    color: '#a855f7', // purple / neural
    accentColor: '#c084fc',
    iconName: 'Zap',
    description: 'Transmits electrical signals, coordinates cognitive reflexes, maintains homeostasis.',
    organCount: 1,
  },
};

export const ANATOMY_PARTS: Record<string, AnatomyPartData> = {
  skull: {
    id: 'skull',
    scientificName: 'Cranium (Neurocranium & Viscerocranium)',
    commonName: 'Human Skull',
    system: 'skeletal',
    subsystem: 'Axial Skeleton',
    description:
      'The skeletal structure that forms the head, supporting the structures of the face and creating a protective cranial cavity enclosing the brain.',
    primaryFunction:
      'Protection of the encephalon (brain), housing sensory receptors (olfactory, visual, auditory, gustatory), and serving as anchorage for mastication and facial expression muscles.',
    clinicalSignificance: [
      'Basilar skull fractures can manifest as Battle sign (mastoid ecchymosis) or raccoon eyes (periorbital ecchymosis).',
      'Craniosynostosis: premature suture fusion causing abnormal head morphology.',
      'Epidural hematoma: classic laceration of the middle meningeal artery underneath the pterion.',
    ],
    innervation: 'Trigeminal nerve (CN V branches: V1 ophthalmic, V2 maxillary, V3 mandibular).',
    bloodSupply: 'Internal & external carotid arterial trees, meningeal branches.',
    landmarks: [
      { name: 'Calvaria', description: 'The upper skullcap enclosing the cerebral hemispheres.' },
      { name: 'Pterion', description: 'H-shaped suture junction prone to traumatic vascular rupture.' },
      { name: 'Foramen Magnum', description: 'Large aperture through which the medulla oblongata exits.' },
    ],
    coordinates: [0, 4.2, 0],
    color: '#e2e8f0',
  },
  brain: {
    id: 'brain',
    scientificName: 'Encephalon',
    commonName: 'Brain',
    system: 'nervous',
    subsystem: 'Central Nervous System (CNS)',
    description:
      'The principal organ of the human nervous system, comprising the cerebrum, cerebellum, and brainstem, encased within the cranium.',
    primaryFunction:
      'Executive cognitive processing, sensory perception synthesis, voluntary motor coordination, affective regulation, and autonomic homeostasis.',
    clinicalSignificance: [
      'Ischemic and hemorrhagic stroke: sudden disruption of cerebral perfusion leading to focal neurological deficits.',
      'Traumatic Brain Injury (TBI): coup-contrecoup parenchymal shearing.',
      'Neurodegenerative tauopathies & synucleinopathies: Alzheimer and Parkinson pathologies.',
    ],
    innervation: 'Parenchyma lacks pain receptors; dura mater innervated by CN V and upper cervical nerves.',
    bloodSupply: 'Circle of Willis (Anterior circulation via Internal Carotid Arteries; Posterior via Vertebrobasilar system).',
    landmarks: [
      { name: 'Cerebral Cortex', description: 'Folded gray matter outer layer responsible for higher-order cognition.' },
      { name: 'Cerebellum', description: 'Fine motor tuning, balance, and proprioceptive integration.' },
      { name: 'Brainstem', description: 'Cardiorespiratory pacemaker centers (pons and medulla).' },
    ],
    coordinates: [0, 4.1, 0],
    color: '#c084fc',
  },
  spine: {
    id: 'spine',
    scientificName: 'Columna Vertebralis',
    commonName: 'Vertebral Column / Spine',
    system: 'skeletal',
    subsystem: 'Axial Skeleton',
    description:
      'A segmented column composed of 33 vertebrae (7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral, and 4 fused coccygeal) extending from the cranium to the pelvis.',
    primaryFunction:
      'Protects the spinal cord, transmits axial body weight through the pelvic girdle, and allows multi-planar truncal flexion, extension, and rotation.',
    clinicalSignificance: [
      'Herniated nucleus pulposus: posterolateral disk herniation causing radiculopathy (e.g. L5-S1 sciatica).',
      'Spondylolisthesis: anterior displacement of a vertebra relative to its subjacent neighbor.',
      'Scoliosis: abnormal lateral curvature of the coronal spinal axis exceeding 10 Cobb degrees.',
    ],
    innervation: 'Recurrent meningeal nerves (sinuvertebral nerves) and posterior rami.',
    bloodSupply: 'Anterior spinal artery, paired posterior spinal arteries, segmental radicular branches.',
    landmarks: [
      { name: 'Atlas & Axis (C1-C2)', description: 'Specialized cervical joints facilitating cranio-cervical rotation.' },
      { name: 'Thoracic Kyphosis', description: 'Posterior convexity accommodating the cardiopulmonary viscera.' },
      { name: 'Lumbar Lordosis', description: 'Anterior convexity balancing center of gravity during bipedalism.' },
    ],
    coordinates: [0, 1.8, -0.2],
    color: '#cbd5e1',
  },
  ribcage: {
    id: 'ribcage',
    scientificName: 'Cavea Thoracis',
    commonName: 'Thoracic Cage / Ribcage',
    system: 'skeletal',
    subsystem: 'Axial Skeleton',
    description:
      'An osteochondral enclosure formed by 12 pairs of ribs, their costal cartilages, the sternum anteriorly, and 12 thoracic vertebrae posteriorly.',
    primaryFunction:
      'Protects vital mediastinal and upper abdominal organs; expands and contracts with diaphragm and intercostal musculature to generate negative intrathoracic ventilatory pressure.',
    clinicalSignificance: [
      'Flail chest: paradoxical chest wall motion resulting from segmented fractures of three or more adjacent ribs.',
      'Tension pneumothorax: intrathoracic pressure elevation causing mediastinal shift and obstructive shock.',
      'Costochondritis: inflammation of the anterior costochondral or chondrosternal junctions.',
    ],
    innervation: 'Intercostal nerves running along the subcostal groove.',
    bloodSupply: 'Posterior intercostal arteries (aortic branches) and anterior intercostal arteries (internal thoracic branches).',
    landmarks: [
      { name: 'Sternum (Manubrium, Body, Xiphoid)', description: 'Anterior midline anchor for true ribs.' },
      { name: 'Costal Cartilage', description: 'Hyaline cartilage offering mechanical elasticity during respiratory excursion.' },
    ],
    coordinates: [0, 2.3, 0.1],
    color: '#94a3b8',
  },
  heart: {
    id: 'heart',
    scientificName: 'Cor Humanum',
    commonName: 'Human Heart',
    system: 'cardiovascular',
    subsystem: 'Central Cardiovascular Pump',
    description:
      'A hollow, muscular, four-chambered organ situated in the middle mediastinum, slightly rotated to the left behind the body of the sternum.',
    primaryFunction:
      'Dual-circuit pulsatile fluid pump generating hydrostatic pressure to propel deoxygenated blood to the pulmonary bed and oxygenated blood to the systemic circulation.',
    clinicalSignificance: [
      'Acute Myocardial Infarction: ischemic necrosis of cardiac myocytes secondary to acute coronary thrombosis.',
      'Arrhythmias: electrophysiological disturbances including Atrial Fibrillation and Ventricular Tachycardia.',
      'Congestive Heart Failure: diminished ejection fraction with pulmonary edema and peripheral venous congestion.',
    ],
    innervation: 'Cardiac plexus (Sympathetic: T1-T5 spinal levels; Parasympathetic: Vagus nerve CN X).',
    bloodSupply: 'Left anterior descending (LAD), Left circumflex (LCx), and Right coronary arteries (RCA).',
    landmarks: [
      { name: 'Left Ventricle', description: 'Thick-walled muscular pump providing systemic perfusion via the aorta.' },
      { name: 'Right Atrium', description: 'Receives deoxygenated systemic venous return via superior and inferior vena cava.' },
      { name: 'Apex Cordis', description: 'Inferolateral conical tip oriented toward the 5th left intercostal space.' },
    ],
    coordinates: [-0.2, 2.3, 0.2],
    color: '#ef4444',
  },
  lungs_left: {
    id: 'lungs_left',
    scientificName: 'Pulmo Sinister',
    commonName: 'Left Lung',
    system: 'respiratory',
    subsystem: 'Pulmonary Parenchyma',
    description:
      'The left lung occupies the left pleural cavity. It is divided into superior and inferior lobes by the oblique fissure and exhibits the cardiac notch.',
    primaryFunction:
      'Alveolar-capillary diffusion of O2 into blood and exhalation of CO2; contributes to acid-base homeostasis.',
    clinicalSignificance: [
      'Aspiration pneumonia: less common in left than right due to sharper angle of the left main bronchus.',
      'Pleural effusion: fluid accumulation in the left costodiaphragmatic recess blunting the radiologic sulcus.',
    ],
    innervation: 'Pulmonary plexus (Vagus nerve CN X and sympathetic chain).',
    bloodSupply: 'Dual supply: Bronchial arteries (nutritive) and Pulmonary artery (gas exchange circuit).',
    landmarks: [
      { name: 'Cardiac Notch', description: 'Anterior concavity accommodating the left ventricular cardiac apex.' },
      { name: 'Lingula', description: 'Anatomical tongue-like projection of the superior left lobe.' },
    ],
    coordinates: [0.6, 2.4, 0.1],
    color: '#06b6d4',
  },
  lungs_right: {
    id: 'lungs_right',
    scientificName: 'Pulmo Dexter',
    commonName: 'Right Lung',
    system: 'respiratory',
    subsystem: 'Pulmonary Parenchyma',
    description:
      'The right lung occupies the right pleural cavity. It has three distinct lobes (superior, middle, and inferior) separated by horizontal and oblique fissures.',
    primaryFunction:
      'Gas exchange; pulmonary vascular reservoir; conversion of Angiotensin I to Angiotensin II via vascular endothelial ACE.',
    clinicalSignificance: [
      'Foreign body aspiration: predominantly lodges in the right mainstem bronchus due to its wider, steeper vertical trajectory.',
      'Pulmonary embolism: thromboembolic occlusion causing ventilation-perfusion mismatch and pulmonary infarction.',
    ],
    innervation: 'Pulmonary plexus (sympathetic postganglionic fibers and parasympathetic vagal branches).',
    bloodSupply: 'Right bronchial artery and right pulmonary artery.',
    landmarks: [
      { name: 'Horizontal Fissure', description: 'Demarcates the superior lobe from the middle lobe.' },
      { name: 'Middle Lobe', description: 'Located anteroinferiorly; susceptible to middle lobe atelectasis.' },
    ],
    coordinates: [-0.7, 2.4, 0.1],
    color: '#06b6d4',
  },
  liver: {
    id: 'liver',
    scientificName: 'Hepar',
    commonName: 'Liver',
    system: 'digestive',
    subsystem: 'Hepatobiliary System',
    description:
      'The largest visceral organ and gland in the body, located mainly in the right hypochondrium and epigastrium, beneath the right hemidiaphragm.',
    primaryFunction:
      'Bile production, xenobiotic detoxification, glycogen storage, plasma protein synthesis (albumin, coagulation factors), and lipid metabolism.',
    clinicalSignificance: [
      'Hepatic cirrhosis: progressive fibrosis leading to portal hypertension, esophageal varices, and ascites.',
      'Hepatocellular carcinoma: primary hepatic malignancy associated with hepatitis B/C and NAFLD/NASH.',
      'Jaundice (Icterus): hyperbilirubinemia resulting from pre-hepatic, intra-hepatic, or post-hepatic biliary obstruction.',
    ],
    innervation: 'Hepatic plexus (vagus nerve and celiac plexus fibers).',
    bloodSupply: 'Dual perfusion: Portal vein (~75% nutrient-rich) and Hepatic artery proper (~25% oxygenated).',
    landmarks: [
      { name: 'Porta Hepatis', description: 'Deep fissure transmitting the portal vein, hepatic artery, and common bile duct.' },
      { name: 'Falciform Ligament', description: 'Peritoneal fold tethering liver to the anterior abdominal wall.' },
    ],
    coordinates: [-0.4, 1.4, 0.25],
    color: '#b45309',
  },
  stomach: {
    id: 'stomach',
    scientificName: 'Gaster / Ventriculus',
    commonName: 'Stomach',
    system: 'digestive',
    subsystem: 'Gastrointestinal Tract',
    description:
      'A J-shaped muscular organ located between the abdominal esophagus and the duodenum in the left upper quadrant of the abdominal cavity.',
    primaryFunction:
      'Mechanical breakdown of food bolus, enzymatic proteolysis via pepsin, secretion of hydrochloric acid (HCl), and intrinsic factor production for vitamin B12 absorption.',
    clinicalSignificance: [
      'Peptic Ulcer Disease (PUD): mucosal erosion caused by Helicobacter pylori colonization or chronic NSAID inhibition of PGE2.',
      'Gastric adenocarcinoma: aggressive malignant neoplasm with early lymphatic spread to Virchow node.',
      'Gastroesophageal Reflux Disease (GERD): incompetent lower esophageal sphincter (LES) resulting in reflux esophagitis.',
    ],
    innervation: 'Anterior and posterior vagal trunks (parasympathetic); celiac plexus (sympathetic).',
    bloodSupply: 'Celiac trunk branches: Left gastric, Right gastric, Gastroepiploic, and Short gastric arteries.',
    landmarks: [
      { name: 'Cardia & Fundus', description: 'Superior proximal dome and gastroesophageal junction.' },
      { name: 'Pyloric Sphincter', description: 'Muscular valve controlling chyme evacuation into the duodenal bulb.' },
    ],
    coordinates: [0.35, 1.45, 0.2],
    color: '#d97706',
  },
  kidneys: {
    id: 'kidneys',
    scientificName: 'Renes (Ren Dexter & Ren Sinister)',
    commonName: 'Kidneys',
    system: 'digestive', // or excretory / renal
    subsystem: 'Renal / Excretory System',
    description:
      'Paired retroperitoneal organs located against the posterior abdominal wall at vertebral levels T12-L3, protected by perirenal adipose caps.',
    primaryFunction:
      'Ultrafiltration of blood plasma, fluid/electrolyte regulation, acid-base balance, erythropoietin secretion for RBC generation, and renin-angiotensin-aldosterone axis activation.',
    clinicalSignificance: [
      'Chronic Kidney Disease (CKD): irreversible GFR decline leading to uremia, hyperkalemia, and metabolic acidosis.',
      'Nephrolithiasis: calculus formation (calcium oxalate, uric acid) causing acute flank colic radiating to the groin.',
      'Acute Tubular Necrosis (ATN): ischemic or nephrotoxic injury to tubular epithelium with characteristic muddy brown casts.',
    ],
    innervation: 'Renal plexus (sympathetic fibers from T10-L1 splanchnic nerves).',
    bloodSupply: 'Renal arteries arising directly from the abdominal aorta (accounting for ~20% of cardiac output).',
    landmarks: [
      { name: 'Renal Cortex & Medulla', description: 'Functional parenchymal compartments containing glomeruli and loops of Henle.' },
      { name: 'Renal Pelvis', description: 'Funnel-shaped basin collecting urine from major calyces to form the ureter.' },
    ],
    coordinates: [0, 1.3, -0.3],
    color: '#991b1b',
  },
  pelvis: {
    id: 'pelvis',
    scientificName: 'Pelvis Ossea',
    commonName: 'Bony Pelvis',
    system: 'skeletal',
    subsystem: 'Appendicular & Axial Skeleton Interface',
    description:
      'A basin-shaped ring of bones connecting the vertebral column to the femora, consisting of the paired hip bones (ilium, ischium, pubis), the sacrum, and the coccyx.',
    primaryFunction:
      'Transfers upper-body axial load to lower extremities during standing and ambulation; protects reproductive and lower urinary viscera.',
    clinicalSignificance: [
      'Pelvic ring disruption (open book fracture): severe traumatic hemorrhage from sheared internal iliac venous plexus.',
      'Acetabular fracture: high-energy hip joint impaction requiring anatomical reconstruction.',
      'Sacroiliitis: hallmark inflammation of the sacroiliac joints in ankylosing spondylitis.',
    ],
    innervation: 'Lumbosacral plexus (L4-S4 nerve roots).',
    bloodSupply: 'Internal and external iliac arterial divisions.',
    landmarks: [
      { name: 'Iliac Crest', description: 'Prominent palpable superior border used as landmark for lumbar puncture (L4 level).' },
      { name: 'Acetabulum', description: 'Deep cotyloid socket receiving the head of the femur.' },
      { name: 'Pubic Symphysis', description: 'Fibrocartilaginous midline joint.' },
    ],
    coordinates: [0, 0.2, 0],
    color: '#cbd5e1',
  },
  femur: {
    id: 'femur',
    scientificName: 'Os Femoris',
    commonName: 'Femur / Thigh Bone',
    system: 'skeletal',
    subsystem: 'Appendicular Skeleton',
    description:
      'The longest, heaviest, and strongest bone in the human body, articulating with the acetabulum proximally and the tibia and patella distally.',
    primaryFunction:
      'Transmits weight from the hip to the knee; acts as a mechanical lever arm for major locomotive muscles (quadriceps femoris, hamstrings, glutei).',
    clinicalSignificance: [
      'Femoral neck fracture: high morbidity in osteoporotic elderly, risking avascular necrosis of the femoral head (AVN).',
      'Femoral shaft fracture: high-energy trauma risking hemorrhagic shock (up to 1.5L blood loss).',
      'Slipped Capital Femoral Epiphysis (SCFE): adolescent hip disorder characterized by posterior displacement of the femoral head.',
    ],
    innervation: 'Femoral, obturator, and sciatic nerves provide articular sensory branches.',
    bloodSupply: 'Medial and lateral femoral circumflex arteries; deep artery of thigh (profunda femoris).',
    landmarks: [
      { name: 'Greater Trochanter', description: 'Prominent lateral insertion point for gluteus medius and minimus.' },
      { name: 'Femoral Head', description: 'Smooth, globular articular surface lined with hyaline cartilage.' },
    ],
    coordinates: [0, -1.2, 0],
    color: '#94a3b8',
  },
};
