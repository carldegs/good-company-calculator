import React, { useContext } from "react";
import MainTable, { Column } from "../components/MainTable";
import {
  Dropdown,
  DropdownItemProps,
  Table,
  Header,
  Popup,
  Image,
} from "semantic-ui-react";
import { DataContext, DataContextType } from "../lib/DataContext";
import { toArray, stringifyEnum } from "../helper";
import {
  ComputedModule,
  FlatComputedModule,
  Bench,
  BenchName,
} from "../lib/model";
import { getModuleImgUrl } from "../lib/modules";

const ModulesTable = () => {
  const { data, updateBench } = useContext(DataContext) as DataContextType;
  const { computedModules } = data;

  const getBenchesOptions = (benches: Bench[]): DropdownItemProps[] =>
    benches.map((bench) => {
      const { name } = bench;

      return {
        key: name,
        value: name,
        text: stringifyEnum(BenchName, name),
      };
    });

  const columns = [
    {
      name: "Name",
      value: "name",
      sortable: true,
      render: (row: FlatComputedModule) => (
        <Header as="h4">
          <Image src={getModuleImgUrl(row.iconId, row.iconSprite)} />
          <Header.Content>{row.name}</Header.Content>
        </Header>
      ),
    },
    {
      name: "Bench",
      value: "selectedBench",
      sortable: true,
      render: (row: FlatComputedModule) => (
        <Dropdown
          onChange={(e: any, { value }: any) => updateBench(row.name, value)}
          options={getBenchesOptions(row.benches)}
          selection
          value={row.selectedBench}
        />
      ),
    },
    {
      name: "Output per day",
      value: "outputPerDay",
      sortable: true,
      format: (val: number) => Number(val).toFixed(2),
    },
    {
      name: "Modules needed",
      value: "numOfNeededModules",
      sortable: true,
      render: (row: FlatComputedModule) => (
        <Popup
          trigger={<span>{Number(row.numOfNeededModules).toFixed(2)}</span>}
        >
          <Popup.Content>
            <Table basic="very" celled>
              <Table.Body>
                {row.parents.map(
                  (parent) =>
                    !!parent.needed && (
                      <Table.Row key={`${parent.name} ${parent.productName}`}>
                        {!!parent.name ? (
                          <Table.Cell>
                            {parent.name}
                            <Header sub>{parent.productName}</Header>
                          </Table.Cell>
                        ) : (
                          <Table.Cell>{parent.productName}</Table.Cell>
                        )}
                        <Table.Cell>{parent.needed}</Table.Cell>
                      </Table.Row>
                    )
                )}
              </Table.Body>
            </Table>
          </Popup.Content>
        </Popup>
      ),
    },
    {
      name: "Benches needed",
      value: "neededBenches",
      sortable: true,
      format: (val: number) => Number(val).toFixed(2),
    },
  ] as Column[];

  const computedModulesArray = toArray(computedModules)
    .map((computedModule: ComputedModule) => computedModule.flatten())
    .filter(
      (flattenedModule: FlatComputedModule) =>
        !!flattenedModule.numOfNeededModules
    );

  return (
    <MainTable sortable columnList={columns} data={computedModulesArray} />
  );
};

export default ModulesTable;
