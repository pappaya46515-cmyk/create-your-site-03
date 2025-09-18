import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TractorMake {
  id: string;
  name: string;
}

interface TractorModel {
  id: string;
  make_id: string;
  model_name: string;
  hp: number;
  hp_range: string;
}

interface VehicleFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors?: Record<string, string>;
}

export function VehicleFormWithMasterData({ formData, setFormData, errors = {} }: VehicleFormProps) {
  const [makes, setMakes] = useState<TractorMake[]>([]);
  const [models, setModels] = useState<TractorModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<TractorModel[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isManualEntry, setIsManualEntry] = useState(false);

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (selectedMake) {
      const filtered = models.filter(model => model.make_id === selectedMake);
      setFilteredModels(filtered);
    } else {
      setFilteredModels([]);
    }
  }, [selectedMake, models]);

  const fetchMasterData = async () => {
    const { data: makesData } = await supabase
      .from('tractor_makes')
      .select('*')
      .order('name');
    
    if (makesData) setMakes(makesData);

    const { data: modelsData } = await supabase
      .from('tractor_models')
      .select('*')
      .order('model_name');
    
    if (modelsData) setModels(modelsData);
  };

  const handleMakeChange = (makeId: string) => {
    setSelectedMake(makeId);
    setSelectedModel("");
    setFormData({ 
      ...formData, 
      model_name: "", 
      hp: "", 
      hp_range: "" 
    });
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    const model = models.find(m => m.id === modelId);
    const make = makes.find(m => m.id === selectedMake);
    
    if (model && make) {
      setFormData({
        ...formData,
        model_name: `${make.name} ${model.model_name}`,
        hp: model.hp.toString(),
        hp_range: model.hp_range
      });
    }
  };

  const toggleManualEntry = () => {
    setIsManualEntry(!isManualEntry);
    if (isManualEntry) {
      // Reset to dropdown mode
      setSelectedMake("");
      setSelectedModel("");
      setFormData({
        ...formData,
        model_name: "",
        hp: "",
        hp_range: ""
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Entry Mode Toggle */}
      <div className="md:col-span-2">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="manual-entry"
            checked={isManualEntry}
            onChange={toggleManualEntry}
            className="h-4 w-4"
          />
          <Label htmlFor="manual-entry" className="cursor-pointer">
            Manual Entry (If make/model not in list)
          </Label>
        </div>
      </div>

      {!isManualEntry ? (
        <>
          {/* Make Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="make">Make *</Label>
            <Select value={selectedMake} onValueChange={handleMakeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make.id} value={make.id}>
                    {make.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Select 
              value={selectedModel} 
              onValueChange={handleModelChange}
              disabled={!selectedMake}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedMake ? "Select model" : "Select make first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.model_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Auto-populated HP */}
          {formData.hp && (
            <div className="space-y-2">
              <Label>HP</Label>
              <Input value={formData.hp} disabled />
            </div>
          )}

          {/* Auto-populated HP Range */}
          {formData.hp_range && (
            <div className="space-y-2">
              <Label>HP Range</Label>
              <Input value={formData.hp_range} disabled />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Manual Entry Fields */}
          <div className="space-y-2">
            <Label htmlFor="model_name">Model Name *</Label>
            <Input
              id="model_name"
              value={formData.model_name}
              onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
              placeholder="e.g., TAFE MF 241"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hp">HP</Label>
            <Input
              id="hp"
              type="number"
              value={formData.hp}
              onChange={(e) => {
                const hp = e.target.value;
                let hpRange = "";
                if (hp) {
                  const hpNum = parseInt(hp);
                  if (hpNum <= 30) hpRange = "0-30";
                  else if (hpNum <= 40) hpRange = "31-40";
                  else if (hpNum <= 50) hpRange = "41-50";
                  else hpRange = "50+";
                }
                setFormData({ 
                  ...formData, 
                  hp: hp,
                  hp_range: hpRange
                });
              }}
              placeholder="e.g., 42"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hp_range">HP Range</Label>
            <Select
              value={formData.hp_range}
              onValueChange={(value) => setFormData({ ...formData, hp_range: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select HP range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-30">0-30</SelectItem>
                <SelectItem value="31-40">31-40</SelectItem>
                <SelectItem value="41-50">41-50</SelectItem>
                <SelectItem value="50+">50+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Model Year */}
      <div className="space-y-2">
        <Label htmlFor="model_year">Model Year *</Label>
        <Input
          id="model_year"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          value={formData.model_year}
          onChange={(e) => setFormData({ ...formData, model_year: parseInt(e.target.value) || new Date().getFullYear() })}
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tractor">Tractor</SelectItem>
            <SelectItem value="commercial">Commercial Vehicle</SelectItem>
            <SelectItem value="agriculture">Agriculture Equipment</SelectItem>
            <SelectItem value="other_vehicle">Other Vehicle</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}