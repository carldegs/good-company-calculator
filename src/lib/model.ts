export enum BenchName {
  InputZone,
  TinkerTable,
  BasicWorkbench,
  ElectronicsWorkbench,
  ChemistryTable,
  AssemblyBench,
  PickandPlaceMachine,
  MechanicsWorkbench,
  PrecisionWorkbench,
  WeldingTable,
  HydraulicsWorkbench,
  AdvancedElectronicsWorkbench
}

export class Module {
  constructor(
    public name: string,
    public neededModules: NeededModule[] = [],
    public benches: Bench[] = [new Bench(BenchName.InputZone, 0)],
    public output: number = 1,
    public iconId: string = "",
    public iconSprite: string = "",
  ) {}

  static parse(object: any): Module {
    const { name, neededModules, benches, output, iconId, iconSprite } = object;

    return new Module(
      name,
      neededModules.map((nm: any) => NeededModule.parse(nm)),
      benches.map((b: any) => Bench.parse(b)),
      output,
      iconId,
      iconSprite
    );
  }
}

export class ParentModule {
  constructor(
    public name: string,
    public productName: string,
    public needed: number
  ) {}

  static parse(object: any): ParentModule {
    const { name, productName, needed } = object;
    return new ParentModule(name, productName, needed);
  }

  public isSameParent(parentB: ParentModule) {
    return (
      this.name === parentB.name &&
      this.productName === parentB.productName
    );
  }
}

export interface FlatComputedModule {
  name: string;
  neededModules: NeededModule[];
  benches: Bench[];
  output: number;
  parents: ParentModule[];
  selectedBench: BenchName | undefined;
  outputPerDay: number;
  numOfNeededModules: number;
  neededBenches: number;
  iconId: string;
  iconSprite: string;
}

export class ComputedModule {
  public outputPerDay = 0;
  public neededModules = 0;
  public neededBenches = 0;

  constructor(
    public module: Module,
    public parents: ParentModule[] = [],
    public selectedBench?: BenchName,
  ) {
    const { output, benches } = module;

    if (!selectedBench) {
      this.selectedBench = benches[0].name;
    }

    const bench: Bench = benches.filter(
      (b) => b.name === this.selectedBench
    )[0];
    this.outputPerDay = output / bench.time;

    parents.forEach((parent) => {
      this.neededModules = this.neededModules + parent.needed;
    });

    this.neededBenches = this.neededModules / this.outputPerDay;
  }

  static parse(object: any): ComputedModule | undefined {
    try {
      const { module, selectedBench, parents } = object;

      return new ComputedModule(
        Module.parse(module),
        parents.map((p: any) => ParentModule.parse(p)),
        selectedBench
      );
    } catch {}
  }

  public flatten(): FlatComputedModule {
    const { name, neededModules, benches, output, iconId, iconSprite } = this.module;

    return {
      name,
      neededModules,
      benches,
      output,
      parents: this.parents,
      selectedBench: this.selectedBench,
      outputPerDay: this.outputPerDay,
      numOfNeededModules: this.neededModules,
      neededBenches: this.neededBenches,
      iconId,
      iconSprite,
    };
  }

  public updateSelectedBench(selectedBench: BenchName): ComputedModule {
    return new ComputedModule(this.module, this.parents, selectedBench);
  }

  public addParent(parent: ParentModule): ComputedModule {
    const sameParentIndex = this.parents
      .map((p) => p.isSameParent(parent))
      .indexOf(true);

    console.log("test2", parent, this.parents, sameParentIndex);

    if (sameParentIndex >= 0) {
      let newParents = this.parents.map((p, i) =>
        i === sameParentIndex
          ? new ParentModule(
              p.name,
              p.productName,
              p.needed + parent.needed
            )
          : p
      );

      return new ComputedModule(this.module, newParents, this.selectedBench);
    }

    return new ComputedModule(
      this.module,
      [...this.parents, parent],
      this.selectedBench
    );
  }
}

export class ComputedProduct {
  constructor(public module: Module, public multiplier: number) {}

  static parse(object: any): ComputedProduct {
    const { module, multiplier } = object;
    return new ComputedProduct(Module.parse(module), multiplier);
  }

  public updateMultiplier(multiplier: number): ComputedProduct {
    return new ComputedProduct(this.module, multiplier);
  }

  public flatten(): FlatComputedProduct {
    const { name, neededModules, benches, output } = this.module;

    return {
      name,
      neededModules,
      benches,
      output,
      multiplier: this.multiplier,
    };
  }
}

export interface FlatComputedProduct {
  name: string;
  multiplier: number;
  neededModules: NeededModule[];
  benches: Bench[];
  output: number;
}

export class NeededModule {
  constructor(public name: string, public amount: number, public iconId?: string, public iconSprite?: string) {}

  static parse(object: any): NeededModule {
    const { name, amount, iconId, iconSprite } = object;
    return new NeededModule(name, amount, iconId, iconSprite);
  }
}

export class Bench {
  constructor(public name: BenchName, public time: number, public iconId?: string, public iconSprite?: string) {}

  static parse(object: any): Bench {
    const { name, time, iconId, iconSprite } = object;
    return new Bench(name, time, iconId, iconSprite);
  }
}

// export class BlueprintModule {
//   constructor(
//     public name: string,
//     public amount: number,
//     public output: number,
//     public parent: string,
//     public bench?: Bench
//   ) {}
// }

// export class FlatBluePrintModule {
//   constructor(
//     public name: string,
//     public benchName = BenchName.InputZone,
//     public parent: string,
//     public time: number = 0,
//     public output: number,
//     public outputPerDay: number,
//     public neededModules: number,
//     public neededBenches: number
//   ) {}
// }

// export interface FlatComputedModule {
//   name: string;
//   benches: Bench[];
//   selectedBench: BenchName;
//   parents: {
//     name: string,
//     product: string,
//     needed: number,
//   }[],
//   outputPerDay: number,
//   neededModules: number,
//   neededBenches: number,
// }

// export class ComputedModule {
//   private selectedBench: BenchName;
//   private parents: {
//     name: string,
//     product: string,
//     needed: number,
//   }[] = [];

//   constructor(private module: Module){
//     this.selectedBench = module.benches[0].name;
//   }

//   public getComputedModule(): FlatComputedModule {
//     const { name, benches, output } = this.module;
//     const outputPerDay = output / benches[this.selectedBench].time;
//     let neededModules = 0;

//     this.parents.forEach(parent => {
//       neededModules = neededModules + parent.needed;
//     });

//     const neededBenches = neededModules / outputPerDay;

//     return {
//       name: name,
//       benches: benches,
//       selectedBench: this.selectedBench,
//       parents: this.parents,
//       outputPerDay,
//       neededModules,
//       neededBenches,
//     }
//   }

//   public selectBench(benchName: BenchName) {
//     this.selectedBench = benchName;
//   }

//   public addParentModule(name: string, product: string, needed: number) {
//     this.parents.push({name, product, needed});
//   }
// }
