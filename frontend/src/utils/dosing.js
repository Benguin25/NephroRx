// Drug dosing calculations based on TKV, age, weight, sex, and serum creatinine

/**
 * PatientData shape:
 * {
 *   age: number,
 *   sex: "male" | "female",
 *   weightKg: number,
 *   serumCreatinine: number, // mg/dL
 *   tkvMeasured: number // cm³
 * }
 *
 * DrugConfig shape:
 * {
 *   id: string,
 *   displayName: string,
 *   category: string,
 *   standardFormula: string, // Description of standard dosing
 *   tkvAdjustedFormula: string // Description of TKV adjustment
 * }
 *
 * DoseResult shape:
 * {
 *   drug: DrugConfig,
 *   doseStdMg: number, // Standard dose based on weight
 *   tkvExpected: number, // Expected TKV
 *   kidneyRatio: number, // KR = TKV_measured / TKV_expected
 *   doseNormalMg: number, // Normal dosage
 *   doseTkvMg: number, // TKV-adjusted dosage
 *   calculations: object // Detailed calculation steps
 * }
 */

// Drug configurations for the 5 drugs
export const DRUG_CONFIGS = [
  {
    id: "cyclophosphamide",
    displayName: "Cyclophosphamide",
    category: "chemo",
    standardFormula: "BSA × 750-1500 or W × 10-15",
    tkvAdjustedFormula: "Dose_std × KR"
  },
  {
    id: "vancomycin",
    displayName: "Vancomycin",
    category: "antibiotic",
    standardFormula: "W × 15-20",
    tkvAdjustedFormula: "Dose_std × KR"
  },
  {
    id: "amikacin",
    displayName: "Amikacin",
    category: "antibiotic",
    standardFormula: "W × 15",
    tkvAdjustedFormula: "Dose_std × KR"
  },
  {
    id: "enoxaparin",
    displayName: "Enoxaparin",
    category: "anticoagulant",
    standardFormula: "W × 1",
    tkvAdjustedFormula: "Dose_std × KR"
  },
  {
    id: "ketamine",
    displayName: "Ketamine",
    category: "anesthesia",
    standardFormula: "W × 0.5-2",
    tkvAdjustedFormula: "Dose_std × KR"
  }
];

/**
 * Calculate TKV_exp (Expected Total Kidney Volume)
 * Formula: TKV_exp = Base × SexF × AgeF × WtF
 */
function calculateTKVExpected(patient) {
  // Base value
  const base = patient.sex === "male" ? 170 : 150; // mL

  // Sex factor
  const sexF = patient.sex === "male" ? 1.0 : 0.90;

  // Age factor: AgeF = 1 - max(0, Age - 40) × 0.01
  const ageF = 1 - Math.max(0, patient.age - 40) * 0.01;

  // Weight factor: WtF = 1 + 0.003 × (Weight_kg - 70)
  const wtF = 1 + 0.003 * (patient.weightKg - 70);

  const tkvExp = base * sexF * ageF * wtF;

  return tkvExp;
}

/**
 * Calculate Kidney Ratio (KR)
 * Formula: KR = TKV_measured / TKV_exp
 */
function calculateKidneyRatio(tkvMeasured, tkvExpected) {
  return tkvMeasured / tkvExpected;
}

/**
 * Calculate standard dose based on drug type
 * Uses the standard formulas from the drug dosing table
 */
function calculateStandardDose(drug, patient) {
  const weight = patient.weightKg;

  switch (drug.id) {
    case "cyclophosphamide":
      // Using middle of range: 12.5 mg/kg (average of 10-15)
      return weight * 12.5;

    case "vancomycin":
      // Using middle of range: 17.5 mg/kg (average of 15-20)
      return weight * 17.5;

    case "amikacin":
      // 15 mg/kg
      return weight * 15;

    case "enoxaparin":
      // 1 mg/kg
      return weight * 1;

    case "ketamine":
      // Using middle of range: 1.25 mg/kg (average of 0.5-2)
      return weight * 1.25;

    default:
      return weight * 10; // Default fallback
  }
}

/**
 * Main function to calculate dosage for a specific drug
 * Returns both normal dosage and TKV-adjusted dosage with detailed calculations
 */
export function calculateDoseForDrug(drug, patient) {
  // Step 1: Calculate standard dose based on weight
  const doseStdMg = calculateStandardDose(drug, patient);

  // Step 2: Calculate expected TKV
  const base = patient.sex === "male" ? 170 : 150;
  const sexF = patient.sex === "male" ? 1.0 : 0.90;
  const ageF = 1 - Math.max(0, patient.age - 40) * 0.01;
  const wtF = 1 + 0.003 * (patient.weightKg - 70);
  const tkvExpected = calculateTKVExpected(patient);

  // Step 3: Calculate kidney ratio (KR)
  const kidneyRatio = calculateKidneyRatio(patient.tkvMeasured, tkvExpected);

  // Step 4: Normal dosage is just the standard dose (based on weight, age, sex, creatinine)
  const doseNormalMg = doseStdMg;

  // Step 5: TKV-adjusted dosage = Normal dose × KR
  const doseTkvMg = doseNormalMg * kidneyRatio;

  // Detailed calculations for display
  const calculations = {
    // Patient info
    age: patient.age,
    sex: patient.sex,
    weight: patient.weightKg,
    serumCreatinine: patient.serumCreatinine,
    tkvMeasured: patient.tkvMeasured,

    // TKV calculation steps
    base: base,
    sexF: sexF,
    ageF: ageF,
    wtF: wtF,
    tkvExpected: tkvExpected,
    kidneyRatio: kidneyRatio,

    // Dosing calculations
    standardDose: doseStdMg,
    normalDose: doseNormalMg,
    tkvAdjustedDose: doseTkvMg,

    // Formula strings
    tkvExpFormula: `${base} mL × ${sexF.toFixed(2)} × ${ageF.toFixed(3)} × ${wtF.toFixed(3)} = ${tkvExpected.toFixed(2)} mL`,
    kidneyRatioFormula: `${patient.tkvMeasured.toFixed(2)} / ${tkvExpected.toFixed(2)} = ${kidneyRatio.toFixed(3)}`,
    normalDoseFormula: `${patient.weightKg} kg × ${(doseStdMg / patient.weightKg).toFixed(2)} mg/kg = ${doseNormalMg.toFixed(1)} mg`,
    tkvDoseFormula: `${doseNormalMg.toFixed(1)} mg × ${kidneyRatio.toFixed(3)} = ${doseTkvMg.toFixed(1)} mg`
  };

  return {
    drug,
    doseStdMg,
    tkvExpected,
    kidneyRatio,
    doseNormalMg,
    doseTkvMg,
    calculations
  };
}

/**
 * Calculate all drugs for a patient
 */
export function calculateAllDoses(patient) {
  return DRUG_CONFIGS.map(drug => calculateDoseForDrug(drug, patient));
}

/**
 * Get a specific drug config by ID
 */
export function getDrugById(drugId) {
  const normalizedId = drugId.toLowerCase();
  const drug = DRUG_CONFIGS.find(d => d.id === normalizedId || d.displayName.toLowerCase() === normalizedId);
  console.log(`getDrugById: searching for "${drugId}", normalized: "${normalizedId}", found:`, drug);
  return drug;
}
