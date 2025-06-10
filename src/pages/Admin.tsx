import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/hooks/use-currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  Star,
  TrendingDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Navigate } from "react-router-dom";
import { products, mockOrders } from "@/data/sampleData";
import { Product, Order } from "@/types";
import LogoUpload from "@/components/admin/LogoUpload";
import CategoryManager from "@/components/admin/CategoryManager";
import EnhancedProductForm from "@/components/admin/EnhancedProductForm";
import OrderViewDialog from "@/components/admin/OrderViewDialog";

const Admin = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { formatPrice } = useCurrency();
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminProducts, setAdminProducts] = useState<Product[]>(products);
  const [adminOrders, setAdminOrders] = useState<Order[]>(mockOrders);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Dialog states
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isOrderViewOpen, setIsOrderViewOpen] = useState(false);

  if (!isAdmin) {
    return <Navigate to="/marketplace" replace />;
  }

  // Calculate statistics
  const calculateStats = () => {
    const totalRevenue = adminOrders.reduce(
      (sum, order) => (order.status !== "cancelled" ? sum + order.total : sum),
      0,
    );

    const monthlyGrowth = 12.5; // Mock data

    // Calculate most demanded products
    const productDemand: Record<
      string,
      { product: Product; totalOrdered: number; revenue: number }
    > = {};

    adminOrders.forEach((order) => {
      if (order.status !== "cancelled") {
        order.items.forEach((item) => {
          if (!productDemand[item.productId]) {
            productDemand[item.productId] = {
              product: item.product,
              totalOrdered: 0,
              revenue: 0,
            };
          }
          productDemand[item.productId].totalOrdered += item.quantity;
          productDemand[item.productId].revenue += item.quantity * item.price;
        });
      }
    });

    const mostDemanded = Object.values(productDemand)
      .sort((a, b) => b.totalOrdered - a.totalOrdered)
      .slice(0, 5);

    return {
      totalUsers: 150,
      totalProducts: adminProducts.length,
      totalOrders: adminOrders.length + 28,
      totalRevenue,
      monthlyGrowth,
      mostDemanded,
      pendingOrders: adminOrders.filter((order) => order.status === "pending")
        .length,
      completedOrders: adminOrders.filter(
        (order) => order.status === "delivered",
      ).length,
    };
  };

  const stats = calculateStats();

  // Order management functions
  const handleMarkOrderComplete = (orderId: string) => {
    setAdminOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "delivered" as const }
          : order,
      ),
    );
    setActionMessage({ type: "success", text: "Order marked as complete!" });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleMarkOrderCancelled = (orderId: string) => {
    setAdminOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "cancelled" as const }
          : order,
      ),
    );
    setActionMessage({
      type: "success",
      text: "Order cancelled successfully!",
    });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleViewOrder = (orderId: string) => {
    const order = adminOrders.find((o) => o.id === orderId);
    if (order) {
      setViewingOrder(order);
      setIsOrderViewOpen(true);
    }
  };

  // Product management functions
  const handleProductSubmit = (
    productData: Omit<Product, "id" | "createdAt">,
  ) => {
    if (editingProduct) {
      // Update existing product
      const updatedProduct: Product = {
        ...productData,
        id: editingProduct.id,
        createdAt: editingProduct.createdAt,
      };

      setAdminProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)),
      );
      setActionMessage({
        type: "success",
        text: "Product updated successfully!",
      });
    } else {
      // Create new product
      const newProduct: Product = {
        ...productData,
        id: `product-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      setAdminProducts((prev) => [...prev, newProduct]);
      setActionMessage({
        type: "success",
        text: "Product created successfully!",
      });
    }

    setShowProductForm(false);
    setEditingProduct(null);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleViewProduct = (product: Product) => {
    alert(
      `Product Details:\n\nName: ${product.name}\nPrice: ${formatPrice(product.price)}\nCategory: ${product.category}\nStock: ${product.stock}\nFeatured: ${product.featured ? "Yes" : "No"}\n\nDescription:\n${product.description}`,
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setAdminProducts((prev) => prev.filter((p) => p.id !== productId));
    setActionMessage({
      type: "success",
      text: "Product deleted successfully!",
    });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const toggleProductFeatured = (productId: string) => {
    setAdminProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, featured: !p.featured } : p,
      ),
    );
    setActionMessage({ type: "success", text: "Product status updated!" });
    setTimeout(() => setActionMessage(null), 3000);
  };

  const recentOrders = adminOrders.slice(0, 5);

  const OrderStatusBadge = ({ status }: { status: string }) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-green-100 text-green-800",
      delivered: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <Badge
        className={
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("admin.dashboard")}
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}. Here's what's happening with your store.
          </p>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <Alert
            className={`mb-6 ${actionMessage.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            <AlertDescription
              className={
                actionMessage.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }
            >
              {actionMessage.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span>{t("admin.dashboard")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center space-x-2"
            >
              <Package className="h-4 w-4" />
              <span>{t("admin.products")}</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>{t("admin.orders")}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{t("admin.users")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Store Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(stats.totalRevenue)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex items-center mt-4">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">
                      +{stats.monthlyGrowth}% from last month
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalOrders}
                      </p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">
                      {stats.pendingOrders} pending • {stats.completedOrders}{" "}
                      completed
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Products
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalProducts}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">
                      {adminProducts.filter((p) => p.featured).length} featured
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalUsers}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mt-4">
                    <span className="text-sm text-gray-600">
                      +8 new this week
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Most Demanded Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-mars-600" />
                  <span>Most Demanded Products</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.mostDemanded.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Total Ordered</TableHead>
                        <TableHead>Revenue Generated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.mostDemanded.map((item, index) => (
                        <TableRow key={item.product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                      ? "bg-gray-400"
                                      : index === 2
                                        ? "bg-amber-600"
                                        : "bg-gray-300"
                                } text-white`}
                              >
                                #{index + 1}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="font-medium">
                                {item.product.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {item.product.category}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {item.totalOrdered} units
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            {formatPrice(item.revenue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Product Data
                    </h3>
                    <p className="text-gray-600">
                      Complete some orders to see most demanded products.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order.id)}
                              title="View Order"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status !== "delivered" &&
                              order.status !== "cancelled" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleMarkOrderComplete(order.id)
                                    }
                                    className="text-green-600 hover:text-green-700"
                                    title="Mark as Complete"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleMarkOrderCancelled(order.id)
                                    }
                                    className="text-red-600 hover:text-red-700"
                                    title="Cancel Order"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {!showProductForm ? (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Products Management</CardTitle>
                  <Button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowProductForm(true);
                    }}
                    className="bg-mars-600 hover:bg-mars-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Variants</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {product.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {product.category}
                          </TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock > 0 ? "secondary" : "destructive"
                              }
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {product.colors && product.colors.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {product.colors.length} colors
                                </Badge>
                              )}
                              {product.sizes && product.sizes.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {product.sizes.length} sizes
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {product.featured && <Badge>Featured</Badge>}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  toggleProductFeatured(product.id)
                                }
                                className={
                                  product.featured
                                    ? "text-yellow-600"
                                    : "text-gray-400"
                                }
                                title={
                                  product.featured
                                    ? "Remove from featured"
                                    : "Mark as featured"
                                }
                              >
                                <Star className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewProduct(product)}
                                title="View Product"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Product
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {product.name}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <EnhancedProductForm
                onSubmit={handleProductSubmit}
                onCancel={() => {
                  setShowProductForm(false);
                  setEditingProduct(null);
                }}
                initialProduct={editingProduct || undefined}
              />
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customerAddress}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{order.customerPhone}</TableCell>
                        <TableCell>
                          <div>
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.product.name} × {item.quantity}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order.id)}
                              title="View Order Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {order.status !== "delivered" &&
                              order.status !== "cancelled" && (
                                <>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-green-600 hover:text-green-700"
                                        title="Mark as Complete"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Complete Order
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Mark order #{order.id} as delivered?
                                          This will notify the customer that
                                          their order has been completed.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleMarkOrderComplete(order.id)
                                          }
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          Mark as Complete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>

                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        title="Cancel Order"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Cancel Order
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cancel order #{order.id}? This action
                                          cannot be undone and the customer will
                                          be notified.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Keep Order
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleMarkOrderCancelled(order.id)
                                          }
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Cancel Order
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    User Management
                  </h3>
                  <p className="text-gray-600">
                    User management features will be available in the full
                    version.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <LogoUpload />
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Store Name</p>
                      <p className="font-medium">Mars Shop / متجر مارس</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Currency</p>
                      <p className="font-medium">Tunisian Dinar (TND)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Languages</p>
                      <p className="font-medium">English, French, Arabic</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Theme</p>
                      <p className="font-medium">Golden Mars Theme</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Order View Dialog */}
      <OrderViewDialog
        order={viewingOrder}
        isOpen={isOrderViewOpen}
        onClose={() => {
          setIsOrderViewOpen(false);
          setViewingOrder(null);
        }}
      />
    </div>
  );
};

export default Admin;
