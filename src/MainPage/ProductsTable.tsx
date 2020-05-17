import React, { useContext } from "react";
import MainTable from "../components/MainTable";
import { Input, Label, Button, Icon } from "semantic-ui-react";
import { DataContext, DataContextType } from "../lib/DataContext";
import { toArray } from "../helper";
import {
  ComputedProduct,
  FlatComputedProduct,
  NeededModule,
} from "../lib/model";

interface IProps {
  onEditProduct?: Function;
}

const ProductsTable = ({
  onEditProduct,
}: IProps) => {
  const { data, changeMultiplier, computeModules, removeProduct } = useContext(
    DataContext
  ) as DataContextType;
  const { products } = data;

  const handleMultiplierChange = (e: any, { name, value }: any) => {
    changeMultiplier(name, value);
    computeModules();
  };

  const handleRemoveProduct = (e: any, { name }: any) => {
    removeProduct(name);
    computeModules();
  };

  const handleEditProduct = (e: any, { name }: any) => {
    const product: FlatComputedProduct = products[name].flatten();
    if (onEditProduct) {
      onEditProduct(product);
    }
  }

  const columns = [
    {
      name: "Name",
      value: "name",
      sortable: true,
    },
    {
      name: "Products needed",
      value: "multiplier",
      sortable: true,
      render: (row: FlatComputedProduct) => (
        <Input
          name={row.name}
          value={row.multiplier}
          onChange={handleMultiplierChange}
          type="number"
        ></Input>
      ),
    },
    {
      name: "Modules",
      value: "neededModules",
      sortable: false,
      render: (row: FlatComputedProduct) => (
        <>
          {row.neededModules.map((neededModule: NeededModule) => {
            const { name, amount } = neededModule;

            return (
              <Label key={name}>
                {name}
                <Label.Detail>{amount}</Label.Detail>
              </Label>
            );
          })}
        </>
      ),
    },
    {
      name: "",
      value: "actions",
      sortable: false,
      render: (row: FlatComputedProduct) => (
        <div style={{display: "flex"}}>
          <Button icon basic name={row.name} onClick={handleEditProduct}>
            <Icon name="edit" />
          </Button>
          <Button icon basic name={row.name} onClick={handleRemoveProduct}>
            <Icon name="remove" />
          </Button>
        </div>
      ),
    },
  ];

  const productsArray = toArray(products).map((product: ComputedProduct) =>
    product.flatten()
  );

  return <MainTable sortable columnList={columns} data={productsArray} />;
};

export default ProductsTable;
