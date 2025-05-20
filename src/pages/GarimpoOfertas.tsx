import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Upload, Pencil, ShoppingCart, Instagram } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GarimpoCard {
  id: string;
  imageUrl: string;
  storeName: string;
  productName: string;
  price: number;
  phone: string;
  whatsappLink: string;
  instagramUrl?: string;
}

const GarimpoOfertas = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [storeName, setStoreName] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [card, setCard] = useState<GarimpoCard | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedCard = localStorage.getItem('garimpoCard');
    if (savedCard) {
      const parsedCard = JSON.parse(savedCard);
      setCard(parsedCard);
      setProductName(parsedCard.productName);
      setStoreName(parsedCard.storeName);
      setPrice(parsedCard.price.toString());
      setPhone(parsedCard.phone);
      setInstagramUrl(parsedCard.instagramUrl || '');
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 6 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 6MB.",
          variant: "destructive",
        });
        return;
      }
      setImage(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (card) {
      setProductName(card.productName);
      setStoreName(card.storeName);
      setPrice(card.price.toString());
      setPhone(card.phone);
      setInstagramUrl(card.instagramUrl || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!image && !card) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    if (!productName || !storeName || !price || !phone) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newCard: GarimpoCard = {
        id: card?.id || Date.now().toString(),
        imageUrl: reader.result as string,
        productName,
        storeName,
        price: parseFloat(price),
        phone,
        whatsappLink: `https://wa.me/${phone.replace(/\D/g, '')}`,
        instagramUrl: instagramUrl || undefined,
      };

      localStorage.setItem('garimpoCard', JSON.stringify(newCard));
      setCard(newCard);
      setIsEditing(false);
      toast({
        title: isEditing ? "Card atualizado" : "Card criado",
        description: isEditing ? "O card foi atualizado com sucesso." : "O card foi criado com sucesso.",
      });
    };

    if (image) {
      reader.readAsDataURL(image);
    } else if (card) {
      const newCard = {
        ...card,
        productName,
        storeName,
        price: parseFloat(price),
        phone,
        whatsappLink: `https://wa.me/${phone.replace(/\D/g, '')}`,
        instagramUrl: instagramUrl || undefined,
      };
      localStorage.setItem('garimpoCard', JSON.stringify(newCard));
      setCard(newCard);
      setIsEditing(false);
      toast({
        title: "Card atualizado",
        description: "O card foi atualizado com sucesso.",
      });
    }
  };

  const handleDelete = () => {
    localStorage.removeItem('garimpoCard');
    setCard(null);
    setImage(null);
    setProductName('');
    setStoreName('');
    setPrice('');
    setPhone('');
    setInstagramUrl('');
    toast({
      title: "Card excluído",
      description: "O card foi excluído com sucesso.",
    });
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const createWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleaned}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Garimpo de Ofertas</h1>

      {!card || isEditing ? (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Produto (máx. 6MB)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!card}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">Nome do Produto</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => {
                if (e.target.value.length <= 40) {
                  setProductName(e.target.value);
                }
              }}
              maxLength={40}
              required
            />
            <p className="text-sm text-gray-500">{productName.length}/40 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName">Nome da Loja</Label>
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => {
                if (e.target.value.length <= 40) {
                  setStoreName(e.target.value);
                }
              }}
              maxLength={40}
              required
            />
            <p className="text-sm text-gray-500">{storeName.length}/40 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (WhatsApp)</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagramUrl">URL do Instagram (opcional)</Label>
            <Input
              id="instagramUrl"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/sua-loja"
            />
          </div>

          <div className="flex justify-end space-x-4">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {isEditing ? 'Atualizar Card' : 'Criar Card'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square relative mb-4">
                <img
                  src={card.imageUrl}
                  alt={card.productName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{card.productName}</h3>
                  <p className="text-gray-600">{card.storeName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-shop-red">
                    R$ {card.price.toFixed(2)}
                  </span>
                  <div className="flex space-x-2">
                    {card.instagramUrl && (
                      <a
                        href={card.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-pink-600 hover:text-pink-700"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                    <a
                      href={createWhatsAppLink(card.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:text-green-700"
                    >
                      <ShoppingCart size={20} />
                    </a>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {formatPhoneNumber(card.phone)}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleEdit}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Link do Card</h3>
            <div className="flex items-center space-x-2">
              <Input
                value={`${window.location.origin}/garimpo/${card.id}`}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/garimpo/${card.id}`);
                  toast({
                    title: "Link copiado",
                    description: "O link do card foi copiado para a área de transferência.",
                  });
                }}
              >
                Copiar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarimpoOfertas; 