import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/hooks/use-currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types";
import {
  Package,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  ShoppingBag,
} from "lucide-react";

interface OrderViewDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderViewDialog = ({ order, isOpen, onClose }: OrderViewDialogProps) => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  if (!order) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      processing: "bg-purple-100 text-purple-800 border-purple-300",
      shipped: "bg-green-100 text-green-800 border-green-300",
      delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "confirmed":
        return "✅";
      case "processing":
        return "🔄";
      case "shipped":
        return "🚚";
      case "delivered":
        return "📦";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-mars-600" />
            <span>Order Details #{order.id}</span>
            <Badge className={`ml-2 ${getStatusColor(order.status)}`}>
              <span className="mr-1">{getStatusIcon(order.status)}</span>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <Card className="border-mars-200 bg-gradient-to-r from-mars-50 to-amber-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-mars-700">
                <ShoppingBag className="h-5 w-5" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-mars-600">
                  {order.items.length}
                </div>
                <div className="text-sm text-gray-600">Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(order.total)}
                </div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Order Date</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">
                  {order.userId ? "Registered" : "Guest"}
                </div>
                <div className="text-sm text-gray-600">Customer Type</div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Customer Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-semibold text-lg">
                        {order.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium">{order.customerPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Delivery Address</p>
                      <p className="font-medium leading-relaxed">
                        {order.customerAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Order Notes</p>
                      <p className="font-medium bg-gray-50 p-3 rounded-lg mt-1">
                        {order.notes}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-600" />
                <span>Order Items ({order.items.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="relative">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-lg object-cover shadow-sm"
                        />
                        <Badge className="absolute -top-2 -right-2 bg-mars-600 text-white">
                          {item.quantity}
                        </Badge>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-gray-600 mt-1">
                          {item.product.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="capitalize">
                            {item.product.category}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Stock: {item.product.stock} units
                          </span>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-sm text-gray-600">Unit Price</div>
                        <div className="font-semibold">
                          {formatPrice(item.price)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </div>
                        <div className="text-lg font-bold text-mars-600">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                    {index < order.items.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <Separator className="my-6" />
              <div className="bg-gradient-to-r from-mars-50 to-amber-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-mars-600" />
                    <span className="text-lg font-semibold">Order Total</span>
                  </div>
                  <div className="text-2xl font-bold text-mars-600">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Order Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Order Created</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="ml-1.5 h-4 w-0.5 bg-gray-300"></div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      order.status !== "pending"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div>
                    <p className="font-medium">Current Status</p>
                    <p className="text-sm text-gray-600">
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderViewDialog;
