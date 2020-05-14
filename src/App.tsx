import React, { useContext, Context } from "react";
import "./App.css";
import {
  computeBlueprint,
  LEDArray,
  SingleCellBattery,
  SimpleCase,
  LEDMatrix,
  PlasticCase,
  joinBlueprints,
  splitRootBlueprints,
  LogicCircuit,
  EnhancedBatteryCell,
} from "./module";
import {
  NeededModule,
  FlatBluePrintModule,
  BenchName,
} from "./model";

import { useState } from "react";
import { useEffect } from "react";
import { stringifyEnum } from "./helper";
import MainTable, { Column } from "./components/MainTable";
import { Input, Header, Container, Button } from "semantic-ui-react";
import AddProductModal from "./components/AddProductModal";
import { DataProvider, DataContext } from "./components/DataContext";

function App() {
  const [rootData, setRootData] = useState([] as FlatBluePrintModule[]);
  const [data, setData] = useState([] as FlatBluePrintModule[]);
  const [multiplier, setMultiplier] = useState({} as Record<string, number>);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e: any, name: string) => setMultiplier({
    ...multiplier,
    [name]: e.target.value,
  });

  const handleButtonClick = () => setShowModal(!showModal);

  const columns = [
    {
      name: "Name",
      value: "name",
      sortable: true,
    },
    {
      name: "Bench",
      value: "benchName",
      sortable: true,
      render: (row: FlatBluePrintModule) => {
        return stringifyEnum(BenchName, row.benchName);
      },
    },
    {
      name: "Needed by",
      value: "parent",
      sortable: true,
    },
    {
      name: "Modules needed",
      value: "neededModules",
      sortable: true,
      render: (row: FlatBluePrintModule) => {
        if (!row.parent) {
          return (
            <Input value={multiplier[row.name]} onChange={e => handleInputChange(e, row.name)}></Input>
          );
        }

        return row.neededModules;
      },
    },
    {
      name: "Benches needed",
      value: "neededBenches",
      sortable: true,
      render: (row: FlatBluePrintModule) => {
        return row.neededBenches.toFixed(2);
      }
    },
  ] as Column[];

  useEffect(() => {
    if (multiplier["CalcTech"] && multiplier["The Brick"]) {



      const sixData: FlatBluePrintModule[] = computeBlueprint(
        "6000",
        [
          new NeededModule(LEDMatrix.name, 1),
          new NeededModule(LogicCircuit.name, 2),
          new NeededModule(EnhancedBatteryCell.name, 1),
          new NeededModule(PlasticCase.name, 1),
        ],
        multiplier["6000"]
      )

      const [newRootData, newData] = splitRootBlueprints(
        joinBlueprints([
          // calcData,
          // brickData,
          // fiveData,
          sixData
        ])
      );

      setData(newData);
      setRootData(newRootData);
    }
  }, [multiplier]);

  useEffect(() => {
    setMultiplier({
      "CalcTech": 1,
      "The Brick": 1,
      "5000": 1,
      "6000": 1,
    });
  }, []);

  return (
    <Container className="App">
      <DataProvider>
        <AddProductModal
          open={showModal}
          onClose={handleButtonClick}
        />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Header>Products</Header>
          <Button onClick={handleButtonClick}>Add Product</Button>
        </div>
        <MainTable sortable columnList={columns} data={rootData} />
        <br />
        <Header>Modules</Header>
        <MainTable sortable columnList={columns} data={data} />
      </DataProvider>
    </Container>
  );
}

export default App;
