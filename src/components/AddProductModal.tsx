import React, { useState, useContext } from "react";
import {
  Modal,
  ModalProps,
  Button,
  Form,
  DropdownItemProps,
  Input,
  Grid,
} from "semantic-ui-react";
import { getModulesArr, computeBlueprint } from "../module";
import { Module, NeededModule } from "../model";
import { DataContext, ActionTypes } from "./DataContext";

interface IProps extends ModalProps {}

const optionsList = getModulesArr().map((module: Module) => {
  const { name } = module;

  return {
    key: name,
    value: name,
    text: name,
  };
});

const AddProductModal = (props: IProps) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState([]);
  const [modules, setModules] = useState({} as Record<string, number>);
  const options: DropdownItemProps[] = optionsList;
  const {data, dispatch} = useContext(DataContext) as any;

  const handleChange = (e: any, { value: val }: any) => {
    setValue(val);

    let newModules = {} as Record<string, number>;
    val.forEach((moduleName: string) => {
      if (!modules[moduleName]) {
        newModules[moduleName] = 0;
      } else {
        newModules[moduleName] = modules[moduleName];
      }
    });

    setModules(newModules);
  };

  const handleNameChange = (e: any, { value: val }: any) => setName(val);

  const handleModuleAmountChange = (
    e: any,
    { value: val, name: moduleName }: any
  ) =>
    setModules({
      ...modules,
      [moduleName]: Number(val),
    });

  const createProduct = () => {
    dispatch({
      type: ActionTypes.AddProduct,
      payload: {
        product: {
          name,
          modules,
        },
      },
    })
    // const neededModules = Object.entries(modules).map(
    //   ([moduleName, amount]: [string, number]) =>
    //     new NeededModule(moduleName, amount)
    // );

    // console.log("x", computeBlueprint(name, neededModules, 1));
  };

  console.log(value, modules);
  return (
    <Modal {...props}>
      <Modal.Header>Add Product</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            label="Product name"
            type="string"
            onChange={handleNameChange}
          />
          <Form.Dropdown
            label="Add modules"
            placeholder="Module"
            multiple
            selection
            value={value}
            search
            options={options}
            onChange={handleChange}
          />
          <Grid container columns={3}>
            {value.map((moduleName) => (
              <Grid.Column key={moduleName}>
                <Form.Field>
                  <Input
                    fluid
                    label={moduleName}
                    name={moduleName}
                    value={modules[moduleName]}
                    onChange={handleModuleAmountChange}
                    type="number"
                  />
                </Form.Field>
              </Grid.Column>
            ))}
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={createProduct}>
          Create Product
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AddProductModal;
