import { Phone, Heart, Eye, FileCheck, IndianRupee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: {
    id: string;
    model_name: string;
    model_year: number;
    category: string;
    ownership_type: string;
    property_owner?: "kamtha" | "party";
    deal_value: number;
    slab_amount: number;
    registration_number: string;
    has_original_rc: boolean;
    has_duplicate_rc: boolean;
    has_insurance: boolean;
    has_form_29: boolean;
    has_form_30: boolean;
    has_noc: boolean;
    status: string;
  };
  isSaved: boolean;
  onToggleSave: () => void;
  onViewDetails: () => void;
}

const VehicleCard = ({ vehicle, isSaved, onToggleSave, onViewDetails }: VehicleCardProps) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)}L`;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getDocumentCount = () => {
    let count = 0;
    if (vehicle.has_original_rc || vehicle.has_duplicate_rc) count++;
    if (vehicle.has_insurance) count++;
    if (vehicle.has_form_29) count++;
    if (vehicle.has_form_30) count++;
    if (vehicle.has_noc) count++;
    return count;
  };

  // Generate equipment image based on category
  const getEquipmentImage = () => {
    const categoryImages: Record<string, string> = {
      'tractor': 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?w=400&h=300&fit=crop',
      'harvester': 'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=400&h=300&fit=crop',
      'tiller': 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?w=400&h=300&fit=crop',
      'plough': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
      'other': 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=300&fit=crop'
    };
    return categoryImages[vehicle.category] || categoryImages.other;
  };

  return (
    <Card className="hover:shadow-strong transition-all hover:scale-105 transform duration-300 overflow-hidden">
      {/* Equipment Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <img 
          src={getEquipmentImage()}
          alt={vehicle.model_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=300&fit=crop';
          }}
        />
        <div className="absolute top-2 right-2">
          <Button
            size="icon"
            variant={isSaved ? "default" : "secondary"}
            onClick={onToggleSave}
            className="bg-white/90 backdrop-blur"
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current text-red-500" : ""}`} />
          </Button>
        </div>
        {vehicle.property_owner === 'kamtha' && (
          <Badge className="absolute top-2 left-2 bg-green-600 text-white">
            ✓ Kamta Property
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div>
          <CardTitle className="text-lg">{vehicle.model_name}</CardTitle>
          <CardDescription>
            {vehicle.model_year} • {vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1)}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price and Slab Amount */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(vehicle.deal_value)}
            </span>
          </div>
          {vehicle.slab_amount > 0 && (
            <Badge variant="outline" className="w-full justify-center">
              <IndianRupee className="w-3 h-3 mr-1" />
              Slab: {formatPrice(vehicle.slab_amount)}
            </Badge>
          )}
        </div>

        {/* Contact Numbers - Prominent Display */}
        <div className="bg-accent/10 p-4 rounded-lg space-y-2">
          <div className="text-center">
            <a 
              href="tel:9448147073" 
              className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              <Phone className="inline-block w-5 h-5 mr-2" />
              9448147073
            </a>
          </div>
          <div className="text-center">
            <a 
              href="tel:9480833792" 
              className="text-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="inline-block w-4 h-4 mr-2" />
              9480833792
            </a>
          </div>
        </div>

        {/* Vehicle Info */}
        {vehicle.registration_number && (
          <div className="text-sm text-muted-foreground">
            Reg: {vehicle.registration_number}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileCheck className="h-4 w-4" />
          <span>{getDocumentCount()} documents available</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full"
          onClick={onViewDetails}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;