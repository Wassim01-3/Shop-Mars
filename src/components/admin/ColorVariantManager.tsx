import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ImageUploader from "./ImageUploader";
import { ProductColor } from "@/types";
import { Plus, Trash2, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorVariantManagerProps {
  colors: ProductColor[];
  onColorsChange: (colors: ProductColor[]) => void;
}

const ColorVariantManager = ({
  colors,
  onColorsChange,
}: ColorVariantManagerProps) => {
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColor, setNewColor] = useState({
    name: "",
    value: "#000000",
  });

  const predefinedColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Gray", value: "#6B7280" },
    { name: "Orange", value: "#F97316" },
  ];

  const handleAddColor = () => {
    if (!newColor.name.trim()) return;

    const colorExists = colors.some(
      (color) => color.name.toLowerCase() === newColor.name.toLowerCase(),
    );

    if (colorExists) return;

    const color: ProductColor = {
      id: `color-${Date.now()}`,
      name: newColor.name,
      value: newColor.value,
      images: [],
    };

    onColorsChange([...colors, color]);
    setNewColor({ name: "", value: "#000000" });
    setIsAddingColor(false);
  };

  const handleRemoveColor = (colorId: string) => {
    onColorsChange(colors.filter((color) => color.id !== colorId));
  };

  const handleColorImagesChange = (colorId: string, images: string[]) => {
    const updatedColors = colors.map((color) =>
      color.id === colorId ? { ...color, images } : color,
    );
    onColorsChange(updatedColors);
  };

  const handlePredefinedColorSelect = (predefinedColor: {
    name: string;
    value: string;
  }) => {
    setNewColor(predefinedColor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Color Variants</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Color Section */}
        <div className="space-y-4">
          {!isAddingColor ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingColor(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Color Variant
            </Button>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="colorName">Color Name</Label>
                  <Input
                    id="colorName"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    placeholder="e.g., Ocean Blue"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colorValue">Color Value</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="colorValue"
                      type="color"
                      value={newColor.value}
                      onChange={(e) =>
                        setNewColor({ ...newColor, value: e.target.value })
                      }
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={newColor.value}
                      onChange={(e) =>
                        setNewColor({ ...newColor, value: e.target.value })
                      }
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Predefined Colors */}
              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handlePredefinedColorSelect(color)}
                      className={cn(
                        "w-8 h-8 rounded border-2 transition-all",
                        color.value === "#FFFFFF"
                          ? "border-gray-300"
                          : "border-transparent",
                        "hover:scale-110 hover:border-gray-400",
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={handleAddColor}
                  disabled={!newColor.name.trim()}
                  size="sm"
                >
                  Add Color
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddingColor(false);
                    setNewColor({ name: "", value: "#000000" });
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Colors */}
        {colors.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
              Color Variants ({colors.length})
            </h3>
            {colors.map((color) => (
              <Card
                key={color.id}
                className="border-l-4"
                style={{ borderLeftColor: color.value }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: color.value }}
                      />
                      <div>
                        <h4 className="font-medium">{color.name}</h4>
                        <p className="text-sm text-gray-600">{color.value}</p>
                      </div>
                      <Badge variant="secondary">
                        {color.images.length} photos
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveColor(color.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Photos for {color.name}</Label>
                    <ImageUploader
                      images={color.images}
                      onImagesChange={(images) =>
                        handleColorImagesChange(color.id, images)
                      }
                      maxImages={5}
                      className="bg-white"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {colors.length === 0 && !isAddingColor && (
          <div className="text-center py-8 text-gray-500">
            <Palette className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No color variants added yet</p>
            <p className="text-sm">
              Add color variants to show different product options
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorVariantManager;
