import { useState, useEffect } from 'react';
import { ShoppingCart, Instagram, Globe } from 'lucide-react';

interface GarimpoCard {
  id: string;
  imageUrl: string;
  productName: string;
  storeName: string;
  price: number;
  phone: string;
  instagramUrl?: string;
}

const GarimpoOfertaView = () => {
  const [card, setCard] = useState<GarimpoCard | null>(null);

  useEffect(() => {
    const savedCard = localStorage.getItem('garimpoCard');
    if (savedCard) {
      setCard(JSON.parse(savedCard));
    }
  }, []);

  if (!card) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Card não encontrado</p>
      </div>
    );
  }

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
    <div className="max-w-sm mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={card.imageUrl}
            alt={card.productName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 space-y-4">
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
          <div className="text-sm text-gray-500">
            {formatPhoneNumber(card.phone)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarimpoOfertaView; 