/**
 * osu!mania star rating source references
 *
 * Core files:
 * - https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/ManiaDifficultyCalculator.cs
 * - https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Skills/Strain.cs
 * - https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Evaluators/IndividualStrainEvaluator.cs
 * - https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Evaluators/OverallStrainEvaluator.cs
 *
 * Shared difficulty framework:
 * - https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/Skills/StrainDecaySkill.cs
 * - https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/Skills/StrainSkill.cs
 * - https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/Preprocessing/DifficultyHitObject.cs
 * - https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/Utils/DifficultyCalculationUtils.cs
 *
 * Key line anchors used:
 * - difficulty_multiplier = 0.018:
 *   https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/ManiaDifficultyCalculator.cs#L27
 * - star rating formula (Strain.DifficultyValue * difficulty_multiplier):
 *   https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/ManiaDifficultyCalculator.cs#L49
 * - individual_decay_base = 0.125:
 *   https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Skills/Strain.cs#L15
 * - overall_decay_base = 0.30:
 *   https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Skills/Strain.cs#L16
 * - strain processing logic:
 *   https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Skills/Strain.cs#L32
 * - individual strain evaluator:
 *   https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Evaluators/IndividualStrainEvaluator.cs#L12
 * - overall strain evaluator (release_threshold, logistic usage):
 *   https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Evaluators/OverallStrainEvaluator.cs#L14
 *   https://github.com/ppy/osu/blob/master/osu.Game.Rulesets.Mania/Difficulty/Evaluators/OverallStrainEvaluator.cs#L56
 * - section decay weight / length (0.9 / 400ms):
 *   https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/Skills/StrainSkill.cs#L21
 *   https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/Skills/StrainSkill.cs#L26
 * - weighted peak aggregation:
 *   https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/Skills/StrainSkill.cs#L124
 * - logistic function definition:
 *   https://github.com/ppy/osu/blob/master/osu.Game/Rulesets/Difficulty/Utils/DifficultyCalculationUtils.cs#L41
 * 
 * Note: This was created with the help of `GPT-5.3 Codex` becasue I (Sling) have not learned C# and was having trouble fully understanding it.
 */


type ManiaHitObject = {
  startTime: number;
  endTime: number;
  column: number;
};

type ManiaDifficultyHitObject = {
  index: number;
  startTime: number;
  endTime: number;
  deltaTime: number;
  column: number;
  columnStrainTime: number;
  previousHitObjects: (ManiaDifficultyHitObject | null)[];
  previous: (backwardsIndex: number) => ManiaDifficultyHitObject | null;
};

const DIFFICULTY_MULTIPLIER = 0.018;
const INDIVIDUAL_DECAY_BASE = 0.125;
const OVERALL_DECAY_BASE = 0.3;
const DECAY_WEIGHT = 0.9;
const SECTION_LENGTH = 400;
const RELEASE_THRESHOLD = 30;

export function calculateManiaStarRating(lines: string[]): number {
  const totalColumns = Number(getLineValueOrDefault(lines, "CircleSize", "4"));
  const hitObjects = parseManiaHitObjects(lines, totalColumns);

  if (hitObjects.length < 2) {
    return 0;
  }

  const difficultyObjects = createDifficultyHitObjects(
    hitObjects,
    totalColumns,
  );
  const strainDifficulty = calculateStrainDifficulty(
    difficultyObjects,
    totalColumns,
  );

  return strainDifficulty * DIFFICULTY_MULTIPLIER;
}

function parseManiaHitObjects(
  lines: string[],
  totalColumns: number,
): ManiaHitObject[] {
  const startIndex = lines.indexOf("[HitObjects]") + 1;
  const endIndex = lines.findIndex((line, i) => line === "" && i > startIndex);
  const sectionLines = lines.slice(startIndex, endIndex).filter(Boolean);

  const result: ManiaHitObject[] = [];

  for (const line of sectionLines) {
    const parts = line.split(",");
    if (parts.length < 5) {
      continue;
    }

    const x = Number(parts[0]);
    const startTime = Number(parts[2]);
    const type = Number(parts[3]);
    const column = Math.floor((x * totalColumns) / 512);

    const isHold = type === 128;
    let endTime = startTime;

    if (isHold) {
      const holdData = parts[5]?.split(":")[0];
      const parsedEndTime = Number(holdData);
      if (Number.isFinite(parsedEndTime)) {
        endTime = parsedEndTime;
      }
    }

    result.push({
      startTime,
      endTime,
      column,
    });
  }

  result.sort((a, b) => Math.round(a.startTime) - Math.round(b.startTime));
  return result;
}

function createDifficultyHitObjects(
  hitObjects: ManiaHitObject[],
  totalColumns: number,
): ManiaDifficultyHitObject[] {
  const objects: ManiaDifficultyHitObject[] = [];
  const perColumnObjects: ManiaDifficultyHitObject[][] = Array.from(
    { length: totalColumns },
    () => [],
  );

  for (let i = 1; i < hitObjects.length; i++) {
    const current = hitObjects[i];
    const last = hitObjects[i - 1];
    const columnObjects = perColumnObjects[current.column];
    const previousInColumn = columnObjects[columnObjects.length - 1] ?? null;

    const previousHitObjects: (ManiaDifficultyHitObject | null)[] = new Array(
      totalColumns,
    ).fill(null);

    if (objects.length > 0) {
      const prev = objects[objects.length - 1];
      for (let j = 0; j < totalColumns; j++) {
        previousHitObjects[j] = prev.previousHitObjects[j];
      }
      previousHitObjects[prev.column] = prev;
    }

    const index = objects.length;
    const difficultyObject: ManiaDifficultyHitObject = {
      index,
      startTime: current.startTime,
      endTime: current.endTime,
      deltaTime: current.startTime - last.startTime,
      column: current.column,
      columnStrainTime: previousInColumn
        ? current.startTime - previousInColumn.startTime
        : current.startTime,
      previousHitObjects,
      previous: (backwardsIndex: number) => {
        const targetIndex = index - (backwardsIndex + 1);
        return targetIndex >= 0 && targetIndex < objects.length
          ? objects[targetIndex]
          : null;
      },
    };

    objects.push(difficultyObject);
    perColumnObjects[current.column].push(difficultyObject);
  }

  return objects;
}

function calculateStrainDifficulty(
  objects: ManiaDifficultyHitObject[],
  totalColumns: number,
): number {
  const individualStrains: number[] = new Array(totalColumns).fill(0);
  let highestIndividualStrain = 0;
  let overallStrain = 1;
  let currentStrain = 0;

  let currentSectionPeak = 0;
  let currentSectionEnd = 0;
  const strainPeaks: number[] = [];

  for (const current of objects) {
    if (current.index === 0) {
      currentSectionEnd =
        Math.ceil(current.startTime / SECTION_LENGTH) * SECTION_LENGTH;
    }

    while (current.startTime > currentSectionEnd) {
      strainPeaks.push(currentSectionPeak);

      const previous = current.previous(0);
      const previousStartTime = previous
        ? previous.startTime
        : current.startTime;

      const initialIndividual = applyDecay(
        highestIndividualStrain,
        currentSectionEnd - previousStartTime,
        INDIVIDUAL_DECAY_BASE,
      );
      const initialOverall = applyDecay(
        overallStrain,
        currentSectionEnd - previousStartTime,
        OVERALL_DECAY_BASE,
      );

      currentSectionPeak = initialIndividual + initialOverall;
      currentSectionEnd += SECTION_LENGTH;
    }

    currentStrain *= applyDecayBase(current.deltaTime, 1);
    currentStrain += strainValueOf(
      current,
      individualStrains,
      () => highestIndividualStrain,
      (value) => {
        highestIndividualStrain = value;
      },
      () => overallStrain,
      (value) => {
        overallStrain = value;
      },
      currentStrain,
    );

    currentSectionPeak = Math.max(currentStrain, currentSectionPeak);
  }

  strainPeaks.push(currentSectionPeak);

  let difficulty = 0;
  let weight = 1;

  const peaks = strainPeaks.filter((peak) => peak > 0).sort((a, b) => b - a);
  for (const peak of peaks) {
    difficulty += peak * weight;
    weight *= DECAY_WEIGHT;
  }

  return difficulty;
}

function strainValueOf(
  current: ManiaDifficultyHitObject,
  individualStrains: number[],
  getHighestIndividualStrain: () => number,
  setHighestIndividualStrain: (value: number) => void,
  getOverallStrain: () => number,
  setOverallStrain: (value: number) => void,
  currentStrain: number,
): number {
  const column = current.column;

  individualStrains[column] = applyDecay(
    individualStrains[column],
    current.columnStrainTime,
    INDIVIDUAL_DECAY_BASE,
  );
  individualStrains[column] += evaluateIndividualDifficulty(current);

  const highestIndividualStrain =
    current.deltaTime <= 1
      ? Math.max(getHighestIndividualStrain(), individualStrains[column])
      : individualStrains[column];
  setHighestIndividualStrain(highestIndividualStrain);

  const overallStrain =
    applyDecay(getOverallStrain(), current.deltaTime, OVERALL_DECAY_BASE) +
    evaluateOverallDifficulty(current);
  setOverallStrain(overallStrain);

  return highestIndividualStrain + overallStrain - currentStrain;
}

function evaluateIndividualDifficulty(
  current: ManiaDifficultyHitObject,
): number {
  const startTime = current.startTime;
  const endTime = current.endTime;

  let holdFactor = 1;

  for (const previous of current.previousHitObjects) {
    if (!previous) {
      continue;
    }

    if (
      definitelyBigger(previous.endTime, endTime, 1) &&
      definitelyBigger(startTime, previous.startTime, 1)
    ) {
      holdFactor = 1.25;
      break;
    }
  }

  return 2 * holdFactor;
}

function evaluateOverallDifficulty(current: ManiaDifficultyHitObject): number {
  const startTime = current.startTime;
  const endTime = current.endTime;
  let isOverlapping = false;

  let closestEndTime = Math.abs(endTime - startTime);
  let holdFactor = 1;
  let holdAddition = 0;

  for (const previous of current.previousHitObjects) {
    if (!previous) {
      continue;
    }

    isOverlapping =
      isOverlapping ||
      (definitelyBigger(previous.endTime, startTime, 1) &&
        definitelyBigger(endTime, previous.endTime, 1) &&
        definitelyBigger(startTime, previous.startTime, 1));

    if (
      definitelyBigger(previous.endTime, endTime, 1) &&
      definitelyBigger(startTime, previous.startTime, 1)
    ) {
      holdFactor = 1.25;
    }

    closestEndTime = Math.min(
      closestEndTime,
      Math.abs(endTime - previous.endTime),
    );
  }

  if (isOverlapping) {
    holdAddition = logistic(closestEndTime, RELEASE_THRESHOLD, 0.27);
  }

  return (1 + holdAddition) * holdFactor;
}

function definitelyBigger(
  a: number,
  b: number,
  acceptableDifference: number,
): boolean {
  return a - b > acceptableDifference;
}

function logistic(
  x: number,
  midpointOffset: number,
  multiplier: number,
  maxValue = 1,
): number {
  return maxValue / (1 + Math.exp(multiplier * (midpointOffset - x)));
}

function applyDecay(
  value: number,
  deltaTime: number,
  decayBase: number,
): number {
  return value * Math.pow(decayBase, deltaTime / 1000);
}

function applyDecayBase(ms: number, decayBase: number): number {
  return Math.pow(decayBase, ms / 1000);
}

function getLineValueOrDefault(
  lines: string[],
  key: string,
  defaultValue: string,
): string {
  const line = lines.find((l) => l.startsWith(`${key}:`));
  if (!line) {
    return defaultValue;
  }

  return line.split(`${key}:`)[1].trim();
}
