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

  return (
    <Card className="hover:shadow-strong transition-all hover:scale-105 transform duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{vehicle.model_name}</CardTitle>
            <CardDescription>
              {vehicle.model_year} • {vehicle.category}
            </CardDescription>
            <Badge 
              variant={vehicle.property_owner === 'kamtha' ? 'default' : 'secondary'}
              className="mt-2"
            >
              {vehicle.property_owner === 'kamtha' ? '✓ Kamtha Property' : 'Third Party'}
            </Badge>
          </div>
          <Button
            size="icon"
            variant={isSaved ? "default" : "outline"}
            onClick={onToggleSave}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
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
              href="tel:8496971246" 
              className="text-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="inline-block w-4 h-4 mr-2" />
              8496971246
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