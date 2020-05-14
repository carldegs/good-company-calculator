import {
  Module,
  BenchName,
  Bench,
  NeededModule,
  BlueprintModule,
  FlatBluePrintModule,
} from "./model";
import findIndex from "lodash/fp/findIndex";

export const Plastic = new Module("Plastic");
export const Chemicals = new Module("Chemicals");
export const ElectronicParts = new Module("Electronic Parts");
export const Metal = new Module("Metal");

export const SimpleCase = new Module(
  "Simple Case",
  [new NeededModule(Plastic.name, 10)],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.BasicWorkbench, 0.27),
  ]
);

export const SingleCellBattery = new Module(
  "Single Cell Battery",
  [new NeededModule(Chemicals.name, 4)],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.BasicWorkbench, 0.27),
  ]
);

export const LEDArray = new Module(
  "LED Array",
  [new NeededModule(ElectronicParts.name, 20)],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.ChemistryTable, 0.27),
  ]
);

export const CircuitBoard = new Module(
  "Circuit Board",
  [
    new NeededModule(Metal.name, 5),
    new NeededModule(Plastic.name, 5),
  ],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.ChemistryTable, 0.27),
  ]
);

export const LEDMatrix = new Module(
  "LED Matrix",
  [
    new NeededModule(LEDArray.name, 1),
    new NeededModule(CircuitBoard.name, 2),
    new NeededModule(ElectronicParts.name, 10),
  ],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.ChemistryTable, 0.27),
  ]
);

export const PlasticCase = new Module(
  "Plastic Case",
  [
    new NeededModule(Plastic.name, 5),
    new NeededModule(SimpleCase.name, 1),
  ],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.BasicWorkbench, 0.27),
  ],
);

export const SimpleCircuit = new Module(
  "Simple Circuit",
  [
    new NeededModule(CircuitBoard.name, 4),
    new NeededModule(ElectronicParts.name, 10),
  ],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.PickAndPlaceMachine, 0.33),
    new Bench(BenchName.ElectronicsWorkbench, 0.27),
  ],
)

export const PlasticParts = new Module(
  "Plastic Parts",
  [
    new NeededModule(Plastic.name, 10),
  ],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.BasicWorkbench, 0.27),
  ],
  50
);

export const LogicCircuit = new Module(
  "Logic Circuit",
  [
    new NeededModule(SimpleCircuit.name, 4),
    new NeededModule(ElectronicParts.name, 15),
    new NeededModule(PlasticParts.name, 5),
  ],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.PickAndPlaceMachine, 0.5),
    new Bench(BenchName.ElectronicsWorkbench, 0.27),
  ],
);

export const EnhancedBatteryCell = new Module(
  "Enhanced Battery Cell",
  [
    new NeededModule(SingleCellBattery.name, 1),
    new NeededModule(Chemicals.name, 2),
    new NeededModule(PlasticParts.name, 15),
  ],
  [
    new Bench(BenchName.TinkerTable, 0.67),
    new Bench(BenchName.ChemistryTable, 0.27),
  ]
);

const modulesArr: Module[] = [
  // Base
  Plastic,
  Chemicals,
  ElectronicParts,
  Metal,
  CircuitBoard,
  // Tier 1
  SimpleCase,
  SingleCellBattery,
  LEDArray,
  PlasticParts,
  // Tier 2
  // BatteryStack,
  PlasticCase,
  // WoodenCase,
  SimpleCircuit,
  // Tier 3
  LEDMatrix,
  LogicCircuit,
  // Tier 4
  EnhancedBatteryCell,
];

const modules: Record<string, any> = modulesArr.reduce((acc: any, curr) => {
  acc[curr.name] = curr;
  return acc;
});

export const getModules = () => modules;
export const getModulesArr = () => modulesArr;
export const getModuleNames = (): string[] => modulesArr.map((module) => module.name);
export const getModule = (moduleName: string): Module => modules[moduleName];

export const computeBlueprint = (
  name: string,
  neededModules: NeededModule[],
  multiplier: number
) => {
  let blueprint: BlueprintModule[] = [];
  let rootName = name;

  blueprint.push(new BlueprintModule(name, multiplier, 1, '', new Bench(BenchName.AssemblyBench, 0.67)));
  recursion(blueprint, multiplier, neededModules, name);

  return blueprint.map((module) => {
    const { name, amount, parent, bench, output } = module;

    const parentName = !!parent ? `${parent}${rootName !== parent ? ` (${rootName})` : ''}` : "";
    const outputPerDay = bench && !!bench.time ? output / bench.time : 0;
    return new FlatBluePrintModule(
      name,
      bench?.name,
      parentName,
      bench?.time,
      output,
      outputPerDay,
      amount,
      bench && !!outputPerDay ? amount / outputPerDay : 0
    );
  }) as FlatBluePrintModule[];
};

const recursion = (
  blueprint: BlueprintModule[],
  multiplier: number,
  currModules: NeededModule[],
  parentName: string,
) => {
  for (let module of currModules) {
    const { name, amount } = module;
    const { benches, neededModules, output } = getModule(name) || {};

    blueprint.push(
      new BlueprintModule(
        name,
        amount * multiplier,
        output,
        parentName,
        !!benches ? benches[0] : undefined
      )
    );

    if (benches && neededModules) {
      recursion(blueprint, multiplier, neededModules, name);
    }
  }
};

export const joinBlueprints = (blueprints: FlatBluePrintModule[][]): FlatBluePrintModule[] => {
  let merged: FlatBluePrintModule[] = [];
  blueprints.flat().forEach(blueprint => {
    const index = findIndex(bp => bp.name === blueprint.name, merged);

    if(index === -1) {
      merged.push(blueprint);
    } else {
      merged[index] = {
        ...merged[index],
        parent: `${merged[index].parent}, ${blueprint.parent}`,
        neededModules: merged[index].neededModules + blueprint.neededModules,
        neededBenches: merged[index].neededBenches + blueprint.neededBenches,
      };
    }
  });

  return merged;
}

export const splitRootBlueprints = (blueprints: FlatBluePrintModule[]): FlatBluePrintModule[][] => {
  let root: FlatBluePrintModule[] = [];
  let data: FlatBluePrintModule[] = [];

  blueprints.forEach(blueprint => {
    if (!blueprint.parent) {
      root.push(blueprint);
    } else {
      data.push(blueprint);
    }
  });

  return [root, data];
}
