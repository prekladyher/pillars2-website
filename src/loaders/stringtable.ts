import { mkdir, readFile, stat, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { ElementCompact, xml2js } from "xml-js";
import { getGameBase } from "./support.js";

export interface StringTable {
  Component: string,
  Name: string,
  Entries: { id: number, default: string, female: string }[]
}

export async function loadStringTable(component: string, name: string) {
  const filepath = join("data/stringtable", component, `${name}.json`);
  try {
    await stat(filepath);
  } catch {
    console.log(`Loading string data '${component}:${name}'...`)
    await mkdir(dirname(filepath), { recursive: true });
    await writeFile(filepath, JSON.stringify(await initStringTable(component, name), null, "  "));
  }
  return JSON.parse(await readFile(filepath, "utf-8"));
}

async function initStringTable(component: string, name: string): Promise<StringTable> {
  const filepath = join(getGameBase(), component, "localized/en/text", `${name}.stringtable`);

  try {
    await stat(filepath);
  } catch {
    console.error(`Invalid stringtable reference: ${filepath}`);
    return {
      Component: component,
      Name: "INVALID",
      Entries: []
    };
  }

  const document = xml2js(await readFile(filepath, "utf-8"), {
    alwaysArray: true,
    compact: true
  }) as ElementCompact;
  const stringTable = document.StringTableFile[0];

  const result: StringTable = {
    Component: component,
    Name: stringTable.Name[0]._text.join(""),
    Entries: []
  };

  for (const stringEntry of stringTable.Entries[0].Entry) {
    result.Entries.push({
      id: parseInt(stringEntry.ID[0]._text.join("")),
      default: stringEntry.DefaultText[0]?._text?.join("") || "",
      female: stringEntry.FemaleText[0]?._text?.join("") || ""
    });
  }

  return result;
}
