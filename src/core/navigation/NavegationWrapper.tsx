import { createBrowserRouter } from "react-router";
import { ProductViewModel } from "../../features/products/presentation/viewmodels/ProductViewModel";
import { OrderViewModel } from "../../features/order/presentation/viewmodels/OrderViewModel";
import {ProductManagementView} from "../../features/products/presentation/pages/ProductManagementView"
import {OrderManagementView} from "../../features/order/presentation/pages/OrderManagementView"
import {OrderListView} from "../../features/order/presentation/pages/OrderListView"
import { OrderUpdatesView } from "../../features/order/presentation/pages/OrderUpdatesView";
const productViewModel = new ProductViewModel();
const orderViewModel = new OrderViewModel();

export const navigationWrapper = createBrowserRouter([
    {
        path: "/products",
        element: <ProductManagementView viewModel={productViewModel} />,
    },
    {
        path: "/",
        element: <OrderManagementView />,
    },
    {
        path: "/order-updates",
        element: <OrderUpdatesView />,
    },
    {
        path: "/order-list",
        element: <OrderListView orderViewModel={orderViewModel} productViewModel={productViewModel} />,
    },
    
]);