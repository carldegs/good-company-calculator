import React, { useContext, useState, useEffect } from "react";
import { Container, Header, Button } from "semantic-ui-react";
import { DataContext, DataContextType } from "../lib/DataContext";
import AddProductModal from "./AddProductModal";
import ProductsTable from "./ProductsTable";
import ModulesTable from "./ModulesTable";
import { FlatComputedProduct } from "../lib/model";

const MainPage = () => {
  const { data } = useContext(DataContext) as DataContextType;
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editProductData, setEditProductData] = useState(null as FlatComputedProduct|null);
  const [editProduct, setEditProduct] = useState(false);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const toggleAddProductModal = () => {
    setShowAddProductModal(!showAddProductModal);
    if (editProduct) {
      setEditProduct(false);
      setEditProductData(null);
    }
  };

  const handleEditProduct = (product: FlatComputedProduct) => {
    console.log('y');
    setEditProductData(product);
    setEditProduct(true);
    setShowAddProductModal(true);
  }

  return (
    <Container>
      <AddProductModal
        open={showAddProductModal}
        onClose={toggleAddProductModal}
        edit={editProduct}
        product={editProductData}
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
      <ProductsTable onEditProduct={handleEditProduct} />
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
