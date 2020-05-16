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
import { Module } from "../lib/model";
import { DataContext, DataContextType } from "../lib/DataContext";

interface IProps extends ModalProps {}

const AddProductModal = ({ onClose, ...props }: IProps) => {
  const { data, addProduct, computeModules } = useContext(DataContext) as DataContextType;
  const [name, setName] = useState("");
  const [value, setValue] = useState([]);
  const [modules, setModules] = useState({} as Record<string, number>);
  const options: DropdownItemProps[] = (Object.values(
    data.modules
  ) as Module[]).map((module: Module) => {
    const { name } = module;

    return {
      key: name,
      value: name,
      text: name,
    };
  });

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
    addProduct(name, modules);
    computeModules();

    setName("");
    setValue([]);
    setModules({});

    if (onClose) {
      // @ts-ignore
      onClose();
    }
  };

  console.log(value, modules);
  return (
    <Modal onClose={onClose} {...props}>
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
