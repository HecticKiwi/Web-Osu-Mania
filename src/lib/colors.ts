import * as d3 from "d3";

// From https://github.com/ppy/osu-web/blob/master/resources/js/utils/beatmap-helper.ts
const difficultyColourSpectrum = d3
  .scaleLinear<string>()
  .domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
  .clamp(true)
  .range([
    "#4290FB",
    "#4FC0FF",
    "#4FFFD5",
    "#7CFF4F",
    "#F6F05C",
    "#FF8068",
    "#FF4E6F",
    "#C645B8",
    "#6563DE",
    "#18158E",
    "#000000",
  ])
  .interpolate(d3.interpolateRgb.gamma(2.2));

const difficultyTextColourSpectrum = d3
  .scaleLinear<string>()
  .domain([9, 9.9, 10.6, 11.5, 12.4])
  .clamp(true)
  .range(["#F6F05C", "#FF8068", "#FF4E6F", "#C645B8", "#6563DE", "#18158E"])
  .interpolate(d3.interpolateRgb.gamma(2.2));

export function getDiffColour(rating: number) {
  if (rating < 0.1) return "#AAAAAA";
  if (rating >= 9) return "#000000";
  return difficultyColourSpectrum(rating);
}

export function getDiffTextColour(rating: number) {
  if (rating < 6.5) return "#000000";
  if (rating < 9) return "#F6F05C";
  return difficultyTextColourSpectrum(rating);
}
