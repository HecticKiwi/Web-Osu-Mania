// I have no idea what file format the skin.ini file uses,
// but this converts it to a .ini for use with the ini NPM package
export function processIniString(iniStr: string) {
  const lines = iniStr
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("//"))
    .map((line) => line.trim().replace(":", "="));

  let sectionIndex = lines.indexOf("[Mania]");

  while (sectionIndex !== -1) {
    const slicedLines = lines.slice(sectionIndex);

    const keys = slicedLines
      .find((line) => line.startsWith("Keys"))
      ?.split(" ")[1];

    if (!keys) {
      throw new Error("Failed to parse skin.ini: [Mania] section missing Keys");
    }

    lines[sectionIndex] = `[Mania${keys}]`;

    sectionIndex = lines.indexOf("[Mania]", sectionIndex + 1);
  }

  return lines.join("\r\n");
}

export function setMissingIniValues(skinManiaIni: any) {
  skinManiaIni.StageHint ??= "mania-stage-hint";
  skinManiaIni.StageLight ??= "mania-stage-light";

  skinManiaIni.Hit0 ??= "mania-hit0-0";
  skinManiaIni.Hit50 ??= "mania-hit50-0";
  skinManiaIni.Hit100 ??= "mania-hit100-0";
  skinManiaIni.Hit200 ??= "mania-hit200-0";
  skinManiaIni.Hit300 ??= "mania-hit300-0";
  skinManiaIni.Hit300g ??= "mania-hit300g-0";
}
