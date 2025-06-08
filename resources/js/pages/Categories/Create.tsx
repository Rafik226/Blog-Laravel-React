import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Image as ImageIcon, Tag, FileText, Upload, X } from 'lucide-react';

interface CreateCategoryProps {
  errors?: Record<string, string>;
}

export default function CreateCategory({ errors = {} }: CreateCategoryProps) {
  const { data, setData, post, processing, reset } = useForm({
    name: '',
    description: '',
    featured_image: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.categories.store'), {
      onSuccess: () => {
        reset();
        setImagePreview('');
      },
    });
  };

  // Fonction pour convertir un fichier en base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Fonction pour gérer la sélection de fichier
  const handleFileSelect = async (file: File) => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      setData('featured_image', base64);
      setImagePreview(base64);
    } catch (error) {
      console.error('Erreur lors de la conversion:', error);
      alert('Erreur lors du traitement de l\'image');
    }
  };

  // Gérer le changement de fichier via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Gérer le drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Supprimer l'image
  const removeImage = () => {
    setData('featured_image', '');
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AppLayout>
      <Head title="Créer une catégorie" />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Créer une nouvelle catégorie
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Ajoutez une nouvelle catégorie pour organiser vos articles
              </p>
            </div>
            
            <Link href={route('categories.index')}>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulaire principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de base */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Informations de base
                  </CardTitle>
                  <CardDescription>
                    Définissez les informations principales de la catégorie
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Nom de la catégorie */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nom de la catégorie <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Ex: Technologie, Voyage, Cuisine..."
                      className={errors.name ? 'border-red-500' : ''}
                      required
                    />
                    {errors.name && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.name}</AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-gray-500">
                      Le nom sera utilisé pour créer automatiquement l'URL de la catégorie
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Décrivez brièvement cette catégorie..."
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <Alert variant="destructive">
                        <AlertDescription>{errors.description}</AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm text-gray-500">
                      La description apparaîtra sur la page de la catégorie
                    </p>
                  </div>
                </CardContent>
              </Card>              {/* Image de couverture */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Image de couverture
                  </CardTitle>
                  <CardDescription>
                    Ajoutez une image représentative pour la catégorie (optionnel)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Zone de drop */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                    } ${errors.featured_image ? 'border-red-500' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {!imagePreview ? (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center">
                          <Upload className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            Glissez-déposez une image ici
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ou cliquez pour sélectionner un fichier
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            PNG, JPG, GIF jusqu'à 5MB
                          </p>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-4"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choisir un fichier
                        </Button>
                        
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Aperçu de l'image"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Changer l'image
                          </Button>
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {errors.featured_image && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.featured_image}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar avec actions */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Création...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Créer la catégorie
                      </>
                    )}
                  </Button>
                  
                  <Link href={route('categories.index')} className="block">
                    <Button variant="outline" className="w-full">
                      Annuler
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Informations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Informations
                  </CardTitle>
                </CardHeader>                <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>• Le nom de la catégorie doit être unique</p>
                  <p>• L'URL sera générée automatiquement à partir du nom</p>
                  <p>• La description peut utiliser du texte simple</p>
                  <p>• L'image sera convertie en base64 et stockée</p>
                  <p>• Formats acceptés: PNG, JPG, GIF (max 5MB)</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
