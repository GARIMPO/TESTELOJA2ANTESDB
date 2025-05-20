import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Globe, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";

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

const GarimpoOfertaView = () => {
  const [card, setCard] = useState<GarimpoCard | null>(null);

  useEffect(() => {
    // Carregar card do localStorage
    const savedCard = localStorage.getItem('garimpo_card');
    if (savedCard) {
      setCard(JSON.parse(savedCard));
    }
  }, []);

  if (!card) {
    return <div>Card não encontrado</div>;
  }

  const handleWhatsAppClick = () => {
    const message = `Olá, gostaria de comprar ${card.productName}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${card.phone.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="relative aspect-square w-full mb-4">
            <img
              src={card.imageUrl}
              alt={card.productName}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{card.productName}</h3>
              <div className="flex items-center gap-3">
                {card.instagramUrl && (
                  <a
                    href={card.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700"
                  >
                    <Instagram size={24} />
                  </a>
                )}
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Globe size={24} />
                </a>
              </div>
            </div>

            <p className="text-xl font-bold text-blue-600">{card.price}</p>
            <h4 className="text-md text-gray-600">{card.storeName}</h4>
            
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-4 text-lg py-6"
            >
              <ShoppingCart className="mr-2 h-6 w-6" />
              Comprar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GarimpoOfertaView; 