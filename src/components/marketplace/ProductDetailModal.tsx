import { useState } from "react";
import { Product } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/hooks/use-currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { OrderForm } from "./OrderForm";

interface ProductDetailModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProductDetailModal = ({
  product,
  open,
  onOpenChange,
}: ProductDetailModalProps) => {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    addItem(product, quantity);
    onOpenChange(false);
  };

  const handleOrderNow = () => {
    setShowOrderForm(true);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  if (showOrderForm) {
    return (
      <OrderForm
        product={product}
        quantity={quantity}
        open={open}
        onOpenChange={onOpenChange}
        onBack={() => setShowOrderForm(false)}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <Badge variant="secondary" className="bg-gray-800 text-white">
                    {t("product.outOfStock")}
                  </Badge>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index
                        ? "border-amber-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-amber-600">
                  {formatPrice(product.price)}
                </span>
                {product.featured && (
                  <Badge className="bg-amber-500">Featured</Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-4">
                {product.stock > 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {product.stock} {t("product.stock")}
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-800"
                  >
                    {t("product.outOfStock")}
                  </Badge>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    {t("product.quantity")}
                  </Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      variant="outline"
                      size="sm"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= product.stock) {
                          setQuantity(value);
                        }
                      }}
                      className="w-20 text-center"
                      min="1"
                      max={product.stock}
                    />
                    <Button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-lg font-semibold">
                  Total: {formatPrice(product.price * quantity)}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button onClick={handleOrderNow} className="w-full" size="lg">
                    {t("product.orderNow")}
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {t("marketplace.addToCart")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
