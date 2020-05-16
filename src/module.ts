import {
  Module,
  BenchName,
  Bench,
  NeededModule,
} from "./lib/model";

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

export const initModulesArr: Module[] = [
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
