export enum BenchName {
  InputZone,
  TinkerTable,
  BasicWorkbench,
  ElectronicsWorkbench,
  ChemistryTable,
  AssemblyBench,
  PickAndPlaceMachine
}

export class Module {
  constructor(
    public name: string,
    public neededModules: NeededModule[] = [],
    public benches: Bench[] = [new Bench(BenchName.InputZone, 0)],
    public output: number = 1,
  ) {}
}

export class NeededModule {
  constructor(public name: string, public amount: number) {}
}

export class Bench {
  constructor(public name: BenchName, public time: number) {}
}

export class BlueprintModule {
  constructor(
    public name: string,
    public amount: number,
    public output: number,
    public parent: string,
    public bench?: Bench,
  ) {}
}

export class FlatBluePrintModule {
  constructor(
    public name: string,
    public benchName = BenchName.InputZone,
    public parent: string,
    public time: number = 0,
    public output: number,
    public outputPerDay: number,
    public neededModules: number,
    public neededBenches: number,
  ){}
}