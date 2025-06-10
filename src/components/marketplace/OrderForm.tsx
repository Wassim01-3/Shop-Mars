import { useState } from "react";
import { Product, Order, OrderItem } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/hooks/use-currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderFormProps {
  product: Product;
  quantity: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export const OrderForm = ({
  product,
  quantity,
  open,
  onOpenChange,
  onBack,
}: OrderFormProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  const { formatPrice } = useCurrency();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = product.price * quantity;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    return (
      formData.name.trim() && formData.phone.trim() && formData.address.trim()
    );
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
    onOpenChange(false);
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const orderItem: OrderItem = {
        productId: product.id,
        quantity,
        price: product.price,
        product,
      };

      const order: Order = {
        id: Date.now().toString(),
        userId: user?.id,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        items: [orderItem],
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        notes: formData.notes,
      };

      // In a real app, this would be saved to a backend
      console.log("Order placed:", order);

      toast({
        title: "Order Placed Successfully!",
        description: t("order.success"),
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-2xl">{t("order.title")}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="flex items-center space-x-4">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-gray-600">
                  Quantity: {quantity} × {formatPrice(product.price)}
                </p>
              </div>
              <div className="text-lg font-bold">{formatPrice(total)}</div>
            </div>
          </div>

          <Separator />

          {/* Customer Information Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("order.name")} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("order.phone")} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t("order.address")} *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter your complete address"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any special instructions or notes (optional)"
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-amber-600">{formatPrice(total)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t("order.addToCart")}
              </Button>

              <Button
                onClick={handlePlaceOrder}
                disabled={!validateForm() || isSubmitting}
                size="lg"
                className="w-full"
              >
                {isSubmitting ? t("common.loading") : t("order.placeOrder")}
              </Button>
            </div>

            <p className="text-sm text-gray-600 text-center">
              * Required fields
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
