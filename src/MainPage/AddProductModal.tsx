import React, { useState, useContext, useEffect } from "react";
import {
  Modal,
  ModalProps,
  Button,
  Form,
  DropdownItemProps,
  Input,
  Grid,
} from "semantic-ui-react";
import { Module, FlatComputedProduct, NeededModule } from "../lib/model";
import { DataContext, DataContextType } from "../lib/DataContext";

interface IProps extends ModalProps {
  edit?: boolean,
  product: FlatComputedProduct|null,
}

const AddProductModal = ({ onClose, edit, product, ...props }: IProps) => {
  const { data, addProduct, computeModules } = useContext(DataContext) as DataContextType;
  const [name, setName] = useState("");
  const [value, setValue] = useState([] as any[]);
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

  useEffect(() => {
    console.log(!!edit, !!product);
    if (edit && product) {
      setName(product.name);
      let newModules: any = {};
      let newValue: any[] = [];
      product.neededModules.forEach((neededModule: NeededModule) => {
        const { amount, name: neededModuleName } = neededModule;
        newModules[neededModuleName] = amount;
        newValue = [...newValue, neededModuleName];
      });

      setValue(newValue);
      setModules(newModules);
    }
  }, [product, edit]);

  const handleChange = (e: any, { value: val }: any) => {
    setValue(val);

    let newModules = {} as Record<string, number>;
    val.forEach((moduleName: string) => {
      if (!modules[moduleName]) {
        newModules[moduleName] = 1;
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

  console.log('x', name, value, modules);
  return (
    <Modal onClose={onClose} {...props}>
      <Modal.Header>Add Product</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            label="Product name"
            type="string"
            onChange={handleNameChange}
            value={name}
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
          { edit ? 'Edit Product' : 'Create Product' }
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AddProductModal;
