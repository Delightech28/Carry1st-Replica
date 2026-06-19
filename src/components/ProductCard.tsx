import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../lib/data';
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import * as Icons from 'lucide-react';
import { SpotifyIcon } from './SpotifyIcon';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Dynamically resolve the icon component or default to Gamepad2
  const IconComponent = product.image === 'Spotify' 
    ? SpotifyIcon 
    : ((Icons as any)[product.image] || Icons.Gamepad2);

  // Find lowest price
  const startPrice = product.variants.length > 0 
    ? Math.min(...product.variants.map(v => v.priceNaira))
    : 0;

  return (
    <Card className="group relative overflow-hidden bg-[#101018] border border-white/5 hover:border-indigo-500/50 hover:bg-[#121220] transition-all duration-300 rounded-2xl flex flex-col justify-between">
      {/* Sparkle background lighting effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge className="bg-white/5 hover:bg-white/10 text-gray-300 font-normal px-2.5 py-0.5 rounded-full border border-white/5 text-[10px] tracking-wide uppercase">
            {product.category}
          </Badge>
          <span className="text-xs text-gray-500 font-mono">
            {product.variants.length} options
          </span>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-[#181825] p-3 rounded-xl text-indigo-400 group-hover:text-indigo-300 group-hover:bg-[#1c1c30] group-hover:scale-110 transition-all duration-300 border border-white/5 shadow-md shadow-black/20 shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-400 leading-snug line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2">
        {/* Sample variants preview tags */}
        <div className="flex flex-wrap gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          {product.variants.slice(0, 3).map((v) => (
            <span 
              key={v.id} 
              className="text-[10px] bg-white/5 border border-white/5 text-gray-300 px-2 py-0.5 rounded-md font-mono"
            >
              {v.value}
            </span>
          ))}
          {product.variants.length > 3 && (
            <span className="text-[10px] text-gray-500 font-mono px-1 py-0.5">
              +{product.variants.length - 3} more
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-white/5 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-gray-500 tracking-wider uppercase font-mono">From</div>
          <div className="text-lg font-extrabold text-white font-mono flex items-baseline leading-none">
            <span className="text-sm font-semibold text-indigo-400 mr-[2px]">₦</span>
            {startPrice.toLocaleString()}
          </div>
        </div>
        <Button 
          size="sm" 
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/10 px-4 group-hover:shadow-indigo-600/30 font-medium text-xs tracking-wide cursor-pointer transition-all duration-300"
          render={<Link to={`/shop/${product.id}`} />}
          nativeButton={false}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};
