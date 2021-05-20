import { createContext, FC, memo, useContext } from "react";
import { firestore } from "../services/firebase";
import { useUser } from "./UserContext";
import { useCollectionData } from "react-firebase-hooks/firestore";

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  provider: string;
  store: string;
};

type ProductsContextType = {
  products: ProductType[] | undefined;
  addProduct: (product: ProductType) => void;
  updateProduct: (product: ProductType) => void;
};

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  addProduct: () => {},
  updateProduct: () => {},
});

const ProductsComponent: FC = ({ children }) => {
  const { user } = useUser();
  const ref = firestore.collection("products");
  const query = ref.where("store", "==", user ? user.uid : "x");
  const [products] = useCollectionData<ProductType>(query, {
    idField: "id",
  });

  const addProduct = (product: ProductType) => {
    const { id, ...rest } = product;
    ref.add({ ...rest });
  };

  const updateProduct = (product: ProductType) => {
    const productRef = ref.doc(product.id);

    productRef.set({ ...product });
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

const ProductsProvider: FC = memo(ProductsComponent);

const useProducts = () => useContext(ProductsContext);

export { ProductsProvider, useProducts };
