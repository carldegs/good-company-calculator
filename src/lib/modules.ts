import axios from "axios";
import { Module, NeededModule, Bench, BenchName } from "./model";
import { toObject } from "../helper";

const EN_LOCALE_URL =
  "https://goodcompanygame.com/localization/goodcompanyBase_en.json";
const MODULE_DATA_URL = "https://goodcompanygame.com/gamedata/materials.json";
const MODULE_IMG_URL = "https://goodcompanygame.com/icons";
const EQUIPMENT_DATA_URL =
  "https://goodcompanygame.com/gamedata/equipment.json";

const PROXY_URL = "https://cors-anywhere.herokuapp.com";

const TIME_PER_DAY = 15;

export const getModuleImgUrl = (iconId: string, iconSprite: string) => `${MODULE_IMG_URL}/${iconSprite}/${iconId}.png`;
const getProxyUrl = (url: string) => `${PROXY_URL}/${url}`;

export const fetchModules = async () => {
  try {
    const localeRes = await axios.get(getProxyUrl(EN_LOCALE_URL));
    const modulesRes = await axios.get(getProxyUrl(MODULE_DATA_URL));
    const equipmentRes = await axios.get(getProxyUrl(EQUIPMENT_DATA_URL));

    const localeData = localeRes.data;
    const modulesData = modulesRes.data.materials;
    const benchesData = equipmentRes.data.equipment
      .filter((e: any) => !!e["crafter_properties"]?.length)
      .map((bench: any) => {
        const { crafter_properties, icon_id, icon_sprite, loca_string } = bench;
        const { crafting_list } = crafter_properties[0];
        let crafting_map: any = {};

        crafting_list.forEach((item: any) => {
          const { loca_string, craft_duration } = item;
          crafting_map[loca_string] = craft_duration;
        });

        return {
          icon_id,
          icon_sprite,
          loca_string,
          crafting_map,
        };
      });

    const modules = modulesData.map((module: any) => {
      const { loca_string, input_materials, output_amount, icon_id, icon_sprite } = module;

      const neededModules: NeededModule[] = input_materials
        ? input_materials.map((input: any) => {
            const { loca_string, material_amount, icon_sprite, icon_id } = input;
            return new NeededModule(localeData[loca_string], material_amount, icon_id, icon_sprite);
          })
        : [];

      let benches = benchesData
        .filter((bench: any) => bench.crafting_map[loca_string])
        .map((bench: any) => {
          const { icon_id, icon_sprite, loca_string: bench_loca_string, crafting_map } = bench;
          const time = crafting_map[loca_string] / TIME_PER_DAY;

          const benchName =
            (BenchName[
              localeData[bench_loca_string].replace(/-|\s/g, "")
            ] as unknown) as BenchName;

          
          console.log('test', localeData[bench_loca_string], benchName);

          return new Bench(
            benchName,
            time,
            icon_id,
            icon_sprite,
          );
        });

      if (!benches.length) {
        benches = [new Bench(BenchName.InputZone, 0)];
      }

      return new Module(
        localeData[loca_string],
        neededModules,
        benches,
        output_amount,
        icon_id,
        icon_sprite,
      );
    });

    return toObject(modules, "name");
  } catch (error) {
    console.error(error);
  }
};
