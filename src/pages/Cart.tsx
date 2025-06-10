import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/hooks/use-currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Cart = () => {
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    notes: "",
  });

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (
      !customerInfo.name.trim() ||
      !customerInfo.phone.trim() ||
      !customerInfo.address.trim()
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create order from cart items
      const order = {
        id: Date.now().toString(),
        userId: user?.id,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          product: item.product,
        })),
        total,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
        notes: customerInfo.notes,
      };

      // In a real app, this would be saved to a backend
      console.log("Order placed:", order);

      clearCart();

      toast({
        title: "Order Placed Successfully!",
        description:
          "We have received your order and will contact you soon to finalize the purchase.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("cart.empty")}
            </h1>
            <p className="text-gray-600 mb-8">
              Start shopping to add items to your cart.
            </p>
            <Link to="/marketplace">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t("cart.title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.product.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-bold text-amber-600">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.product.stock < 10 && (
                          <Badge variant="secondary" className="text-xs">
                            Only {item.product.stock} left
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1,
                            )
                          }
                          variant="outline"
                          size="sm"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value >= 1 && value <= item.product.stock) {
                              handleUpdateQuantity(item.productId, value);
                            }
                          }}
                          className="w-16 text-center"
                          min="1"
                          max={item.product.stock}
                        />
                        <Button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1,
                            )
                          }
                          disabled={item.quantity >= item.product.stock}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Item Total and Remove */}
                      <div className="text-right">
                        <div className="font-bold text-lg">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                        <Button
                          onClick={() => removeItem(item.productId)}
                          variant="ghost"
                          size="sm"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t("cart.remove")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary and Checkout */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>{t("cart.total")}</span>
                  <span className="text-amber-600">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="checkout-name">{t("order.name")} *</Label>
                  <Input
                    id="checkout-name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="checkout-phone">{t("order.phone")} *</Label>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="checkout-address">
                    {t("order.address")} *
                  </Label>
                  <Textarea
                    id="checkout-address"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="checkout-notes">Additional Notes</Label>
                  <Textarea
                    id="checkout-notes"
                    value={customerInfo.notes}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    placeholder="Any special instructions (optional)"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isCheckingOut
                ? t("common.loading")
                : `${t("cart.checkout")} - ${formatPrice(total)}`}
            </Button>

            <Link to="/marketplace">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
