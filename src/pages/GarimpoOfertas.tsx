import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface GarimpoCard {
  id: string;
  imageUrl: string;
  storeName: string;
  productName: string;
  price: string;
  phone: string;
  whatsappLink: string;
  instagramUrl: string;
}

const GarimpoOfertas = () => {
  const [image, setImage] = useState<string>('');
  const [storeName, setStoreName] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [card, setCard] = useState<GarimpoCard | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Carregar card existente do localStorage
    const savedCard = localStorage.getItem('garimpo_card');
    if (savedCard) {
      setCard(JSON.parse(savedCard));
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 6 * 1024 * 1024) { // 6MB em bytes
        toast.error('A imagem deve ter no máximo 6MB');
        return;
      }
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image || !storeName || !productName || !price || !phone) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const whatsappLink = `https://wa.me/${phone.replace(/\D/g, '')}`;
    
    const newCard: GarimpoCard = {
      id: Date.now().toString(),
      imageUrl: image,
      storeName,
      productName,
      price,
      phone,
      whatsappLink,
      instagramUrl
    };
    
    localStorage.setItem('garimpo_card', JSON.stringify(newCard));
    setCard(newCard);
    toast.success('Card criado com sucesso!');
  };

  const handleDelete = () => {
    localStorage.removeItem('garimpo_card');
    setCard(null);
    setImage('');
    setStoreName('');
    setProductName('');
    setPrice('');
    setPhone('');
    setInstagramUrl('');
    toast.success('Card excluído com sucesso!');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Garimpo de Ofertas</CardTitle>
        </CardHeader>
        <CardContent>
          {!card ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Imagem do Produto*</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <p className="text-sm text-gray-500">
                  Tamanho máximo: 6MB. Formatos aceitos: JPG, PNG, GIF
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Nome do Produto*</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => {
                    if (e.target.value.length <= 40) {
                      setProductName(e.target.value);
                    }
                  }}
                  placeholder="Nome do produto em promoção"
                  maxLength={40}
                  required
                />
                <p className="text-sm text-gray-500">
                  {productName.length}/40 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja*</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => {
                    if (e.target.value.length <= 40) {
                      setStoreName(e.target.value);
                    }
                  }}
                  placeholder="Nome da sua loja"
                  maxLength={40}
                  required
                />
                <p className="text-sm text-gray-500">
                  {storeName.length}/40 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço*</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="R$ 0,00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (WhatsApp)*</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">URL do Instagram</Label>
                <Input
                  id="instagram"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/sua-loja"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="mr-2 h-4 w-4" />
                Publicar Card
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <img
                  src={card.imageUrl}
                  alt={card.storeName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{card.storeName}</h3>
                <p className="text-xl font-bold text-shop-red">{card.price}</p>
                <a
                  href={card.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800"
                >
                  {card.phone}
                </a>
              </div>

              <div className="space-y-2">
                <Label>Visualização do Card</Label>
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={`${window.location.origin}/garimpo/${card.id}`}
                    className="w-full h-[400px]"
                    title="Visualização do Card"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Use este iframe para incorporar o card em outros sites. Copie o código abaixo:
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    value={`<iframe src="${window.location.origin}/garimpo/${card.id}" width="100%" height="400" frameborder="0" title="Card do Garimpo de Ofertas"></iframe>`}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`<iframe src="${window.location.origin}/garimpo/${card.id}" width="100%" height="400" frameborder="0" title="Card do Garimpo de Ofertas"></iframe>`);
                      toast.success('Código do iframe copiado!');
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Card
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GarimpoOfertas; 