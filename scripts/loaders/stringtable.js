import { mkdir, readFile, stat, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { xml2js } from "xml-js";
import { getGameBase } from "./support.js";

/** @typedef {import("../../src/types.js").StringTable} StringTable */

/**
 * @param {string} component Component name.
 * @param {string} name String table name (path).
 * @param {string} base Database base path.
 * @return {Promise<StringTable>} Loaded string table.
 */
export async function loadStringTable(component, name, base) {
  const filepath = join(base, "stringtable", component, `${name}.json`);
  try {
    await stat(filepath);
  } catch {
    console.log(`Loading string data '${component}:${name}'...`);
    await mkdir(dirname(filepath), { recursive: true });
    await writeFile(filepath, JSON.stringify(await initStringTable(component, name), null, "  "));
  }
  return JSON.parse(await readFile(filepath, "utf-8"));
}

/**
 * @param {string} component Component name.
 * @param {string} name String table name (path).
 * @return {Promise<StringTable>} Loaded string table.
 */
async function initStringTable(component, name)  {
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

  /** @type {import("xml-js").ElementCompact} */
  const document = xml2js(await readFile(filepath, "utf-8"), {
    alwaysArray: true,
    compact: true
  });
  const stringTable = document.StringTableFile[0];

  /** @type {StringTable} */
  const result = {
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
