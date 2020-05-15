import React, { useContext } from "react";
import MainTable from "../components/MainTable";
import { Input } from "semantic-ui-react";
import { FlatBluePrintModule } from "../model";
import { DataContext, DataContextType } from "../components/DataContext";
import { toArray } from "../helper";

const ProductsTable = () => {
  const { data, changeMultiplier } = useContext(DataContext) as DataContextType;
  const { products } = data;

  const handleMultiplierChange = (e: any, { name, value }: any) => {
    changeMultiplier(name, value);
  };

  const columns = [
    {
      name: "Name",
      value: "name",
      sortable: true,
    },
    {
      name: "Modules needed",
      value: "neededModules",
      sortable: true,
      render: (row: FlatBluePrintModule) => {
        if (!row.parent) {
          return (
            <Input
              name={row.name}
              value={products[row.name].multiplier}
              onChange={handleMultiplierChange}
            ></Input>
          );
        }

        return row.neededModules;
      },
    },
  ];
  return (
    <MainTable
      sortable
      columnList={columns}
      data={toArray(products)}
    />
  );
};

export default ProductsTable;
