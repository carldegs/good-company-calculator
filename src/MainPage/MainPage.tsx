import React, { useContext, useState, useEffect } from "react";
import { Container, Header, Button } from "semantic-ui-react";
import { DataContext, DataContextType } from "../lib/DataContext";
import AddProductModal from "./AddProductModal";
import ProductsTable from "./ProductsTable";
import ModulesTable from "./ModulesTable";

const MainPage = () => {
  const { data } = useContext(DataContext) as DataContextType;
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const toggleAddProductModal = () => {
    setShowAddProductModal(!showAddProductModal);
  };

  return (
    <Container>
      <AddProductModal
        open={showAddProductModal}
        onClose={toggleAddProductModal}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header>Products</Header>
        <Button onClick={toggleAddProductModal}>Add Product</Button>
      </div>
      <ProductsTable />
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Header>Modules</Header>
      </div>
      <ModulesTable />
    </Container>
  );
};

export default MainPage;
