import React, { useContext, useState, useEffect } from "react";
import { Container, Header, Button } from "semantic-ui-react";
import { DataContext } from "../components/DataContext";
import AddProductModal from "./AddProductModal";
import ProductsTable from "./ProductsTable";

const MainPage = () => {
  const { data } = useContext(DataContext) as any;
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
      <br/>
      <Button fluid>Compute Modules</Button>
      <br/>
    </Container>
  );
};

export default MainPage;
