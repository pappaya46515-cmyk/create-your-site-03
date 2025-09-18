import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';

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
  make?: TractorMake;
}

export function TractorMasterData() {
  const [makes, setMakes] = useState<TractorMake[]>([]);
  const [models, setModels] = useState<TractorModel[]>([]);
  const [isAddMakeOpen, setIsAddMakeOpen] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState({
    make_id: '',
    model_name: '',
    hp: '',
    hp_range: ''
  });
  const [editingMake, setEditingMake] = useState<TractorMake | null>(null);
  const [editingModel, setEditingModel] = useState<TractorModel | null>(null);

  useEffect(() => {
    fetchMakes();
    fetchModels();
  }, []);

  const fetchMakes = async () => {
    const { data, error } = await supabase
      .from('tractor_makes')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('Failed to fetch makes');
      return;
    }
    setMakes(data || []);
  };

  const fetchModels = async () => {
    const { data, error } = await supabase
      .from('tractor_models')
      .select(`
        *,
        make:tractor_makes(id, name)
      `)
      .order('model_name');
    
    if (error) {
      toast.error('Failed to fetch models');
      return;
    }
    setModels(data || []);
  };

  const handleAddMake = async () => {
    if (!newMake.trim()) {
      toast.error('Please enter a make name');
      return;
    }

    const { error } = await supabase
      .from('tractor_makes')
      .insert({ name: newMake.trim().toUpperCase() });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Make added successfully');
    setNewMake('');
    setIsAddMakeOpen(false);
    fetchMakes();
  };

  const handleAddModel = async () => {
    if (!newModel.make_id || !newModel.model_name || !newModel.hp || !newModel.hp_range) {
      toast.error('Please fill all fields');
      return;
    }

    const { error } = await supabase
      .from('tractor_models')
      .insert({
        make_id: newModel.make_id,
        model_name: newModel.model_name.trim().toUpperCase(),
        hp: parseInt(newModel.hp),
        hp_range: newModel.hp_range
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Model added successfully');
    setNewModel({ make_id: '', model_name: '', hp: '', hp_range: '' });
    setIsAddModelOpen(false);
    fetchModels();
  };

  const handleUpdateMake = async () => {
    if (!editingMake || !editingMake.name.trim()) {
      toast.error('Please enter a make name');
      return;
    }

    const { error } = await supabase
      .from('tractor_makes')
      .update({ name: editingMake.name.trim().toUpperCase() })
      .eq('id', editingMake.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Make updated successfully');
    setEditingMake(null);
    fetchMakes();
  };

  const handleUpdateModel = async () => {
    if (!editingModel) return;

    const { error } = await supabase
      .from('tractor_models')
      .update({
        make_id: editingModel.make_id,
        model_name: editingModel.model_name.trim().toUpperCase(),
        hp: editingModel.hp,
        hp_range: editingModel.hp_range
      })
      .eq('id', editingModel.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Model updated successfully');
    setEditingModel(null);
    fetchModels();
  };

  const handleDeleteMake = async (id: string) => {
    if (!confirm('Are you sure? This will delete all models under this make.')) return;

    const { error } = await supabase
      .from('tractor_makes')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Make deleted successfully');
    fetchMakes();
    fetchModels();
  };

  const handleDeleteModel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this model?')) return;

    const { error } = await supabase
      .from('tractor_models')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Model deleted successfully');
    fetchModels();
  };

  const getHPRange = (hp: number): string => {
    if (hp <= 30) return '0-30';
    if (hp <= 40) return '31-40';
    if (hp <= 50) return '41-50';
    return '50+';
  };

  return (
    <DashboardLayout userRole="admin">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tractor Master Data</h1>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import Excel
          </Button>
        </div>

        <Tabs defaultValue="makes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="makes">Makes</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
          </TabsList>

          <TabsContent value="makes" className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tractor Makes</h2>
                <Button onClick={() => setIsAddMakeOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Make
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Make Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {makes.map((make) => (
                    <TableRow key={make.id}>
                      <TableCell className="font-medium">{make.name}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingMake(make)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMake(make.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Tractor Models</h2>
                <Button onClick={() => setIsAddModelOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Model
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Make</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>HP</TableHead>
                    <TableHead>HP Range</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>{model.make?.name}</TableCell>
                      <TableCell className="font-medium">{model.model_name}</TableCell>
                      <TableCell>{model.hp}</TableCell>
                      <TableCell>{model.hp_range}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingModel(model)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteModel(model.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Make Dialog */}
        <Dialog open={isAddMakeOpen} onOpenChange={setIsAddMakeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Make</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="make-name">Make Name</Label>
                <Input
                  id="make-name"
                  value={newMake}
                  onChange={(e) => setNewMake(e.target.value)}
                  placeholder="e.g., TAFE, MAHINDRA"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddMakeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMake}>Add Make</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Model Dialog */}
        <Dialog open={isAddModelOpen} onOpenChange={setIsAddModelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Model</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="model-make">Make</Label>
                <Select
                  value={newModel.make_id}
                  onValueChange={(value) => setNewModel({ ...newModel, make_id: value })}
                >
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
              <div>
                <Label htmlFor="model-name">Model Name</Label>
                <Input
                  id="model-name"
                  value={newModel.model_name}
                  onChange={(e) => setNewModel({ ...newModel, model_name: e.target.value })}
                  placeholder="e.g., MF 241"
                />
              </div>
              <div>
                <Label htmlFor="model-hp">HP</Label>
                <Input
                  id="model-hp"
                  type="number"
                  value={newModel.hp}
                  onChange={(e) => {
                    const hp = e.target.value;
                    setNewModel({ 
                      ...newModel, 
                      hp,
                      hp_range: hp ? getHPRange(parseInt(hp)) : ''
                    });
                  }}
                  placeholder="e.g., 42"
                />
              </div>
              <div>
                <Label htmlFor="model-hp-range">HP Range</Label>
                <Select
                  value={newModel.hp_range}
                  onValueChange={(value) => setNewModel({ ...newModel, hp_range: value })}
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModelOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddModel}>Add Model</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Make Dialog */}
        <Dialog open={!!editingMake} onOpenChange={() => setEditingMake(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Make</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-make-name">Make Name</Label>
                <Input
                  id="edit-make-name"
                  value={editingMake?.name || ''}
                  onChange={(e) => setEditingMake(editingMake ? { ...editingMake, name: e.target.value } : null)}
                  placeholder="e.g., TAFE, MAHINDRA"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingMake(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMake}>Update Make</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Model Dialog */}
        <Dialog open={!!editingModel} onOpenChange={() => setEditingModel(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Model</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-model-make">Make</Label>
                <Select
                  value={editingModel?.make_id || ''}
                  onValueChange={(value) => setEditingModel(editingModel ? { ...editingModel, make_id: value } : null)}
                >
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
              <div>
                <Label htmlFor="edit-model-name">Model Name</Label>
                <Input
                  id="edit-model-name"
                  value={editingModel?.model_name || ''}
                  onChange={(e) => setEditingModel(editingModel ? { ...editingModel, model_name: e.target.value } : null)}
                  placeholder="e.g., MF 241"
                />
              </div>
              <div>
                <Label htmlFor="edit-model-hp">HP</Label>
                <Input
                  id="edit-model-hp"
                  type="number"
                  value={editingModel?.hp || ''}
                  onChange={(e) => {
                    const hp = parseInt(e.target.value);
                    setEditingModel(editingModel ? { 
                      ...editingModel, 
                      hp,
                      hp_range: getHPRange(hp)
                    } : null);
                  }}
                  placeholder="e.g., 42"
                />
              </div>
              <div>
                <Label htmlFor="edit-model-hp-range">HP Range</Label>
                <Select
                  value={editingModel?.hp_range || ''}
                  onValueChange={(value) => setEditingModel(editingModel ? { ...editingModel, hp_range: value } : null)}
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingModel(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateModel}>Update Model</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}