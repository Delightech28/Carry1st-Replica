import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { 
  Gamepad2, 
  Music, 
  Wifi, 
  Tv, 
  Layers, 
  ShieldCheck, 
  CreditCard, 
  Zap, 
  Users, 
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const { data: products, isLoading } = useProducts();

  // Get a list of 4 featured products (first 4 items in data or 1 from each category)
  const featuredProducts = products?.slice(0, 4) || [];

  const categories = [
    { name: 'Gaming', count: '4 Games', icon: Gamepad2, slug: 'Gaming', desc: 'Skins, CP, Diamonds & Steam cards', color: 'text-rose-400 bg-rose-500/10' },
    { name: 'Streaming', count: '3 Vouchers', icon: Music, slug: 'Streaming', desc: 'Spotify, YouTube & tool memberships', color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Data & Airtime', count: '3 Networks', icon: Wifi, slug: 'Data & Airtime', desc: 'MTN, Glo, Airtel instant gifting data', color: 'text-blue-400 bg-blue-500/10' },
    { name: 'Bills', count: '3 billers', icon: Tv, slug: 'Bills', desc: 'DSTV decoder renewal, electricity token pins', color: 'text-amber-400 bg-amber-500/10' }
  ];

  const steps = [
    { num: '01', title: 'Choose Product', desc: 'Select the desired gaming item, streaming voucher or data top-up bundle.', icon: Layers },
    { num: '02', title: 'Enter Delivery & Pay', desc: 'Input your Player ID, decoder, or mobile number and complete secure Paystack validation.', icon: CreditCard },
    { num: '03', title: 'Instant Delivery', desc: 'We deliver your gaming points, data transfer or token PIN directly on screen & to your email.', icon: Zap }
  ];

  const testimonials = [
    { name: 'Tunde Olatunji', role: 'CODM Competitive Player', quote: 'I use Carry1st to top up my weapon battle passes. The CP is credited in less than 30 seconds!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
    { name: 'Chioma Kelechi', role: 'UI/UX Freelancer', quote: 'Renewing my Canva Pro and getting Glo data SME on the same site saves me from transaction delays.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    { name: 'Musa Abdullahi', role: 'Tech Enthusiast', quote: 'The wallet system is a game-changer. I fund my wallet with ₦10,000, and checkout on data and internet without typing my card.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl text-center space-y-6 relative">
          <Badge className="bg-indigo-500/10 border-indigo-500/30 text-indigo-300 px-3.5 py-1 text-[10px] sm:text-xs rounded-full font-mono tracking-wide uppercase hover:bg-indigo-500/20">
            ⚡️ Over 100,000+ top-ups completed this month
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Instant Digital Goods & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-500 bg-clip-text text-transparent">
              Top-Up Solutions
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            The premium provider of game credits, streaming subscriptions, and internet mobile bundles in Nigeria. Safe, fast, and delivered in milliseconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-6 rounded-2xl text-base shadow-xl shadow-indigo-600/20 w-full sm:w-auto cursor-pointer" render={
              <Link to="/shop" className="flex items-center gap-2" />
            } nativeButton={false}>
              Explore Digital Shop
              <ArrowRight className="w-5 h-5 animate-pulse" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/10 text-gray-300 hover:bg-white/5 font-medium px-8 py-6 rounded-2xl text-base w-full sm:w-auto" render={
              <a href="#how-it-works" />
            } nativeButton={false}>
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories Card Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Featured Categories
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            Top-up your lifestyle instant-channels with absolute peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link 
                to={`/shop?category=${encodeURIComponent(cat.slug)}`} 
                key={idx}
                className="group relative bg-[#0e0e15] border border-white/5 hover:border-indigo-500/55 rounded-2xl p-6 hover:bg-[#121222] transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className={`${cat.color} p-3 rounded-xl transition-transform group-hover:scale-110 duration-300 shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <div className="space-y-1.5 mt-4">
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-snug">
                    {cat.desc}
                  </p>
                </div>
                <span className="text-[10px] text-gray-500 font-mono mt-2 block">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Trending Top-Ups
            </h2>
            <p className="text-gray-400 text-sm">
              Our most requested gaming pins, data SME options and bill payments this week.
            </p>
          </div>
          <Button variant="ghost" className="text-indigo-400 hover:text-white hover:bg-white/5 leading-none px-4 py-2 font-medium cursor-pointer" render={
            <Link to="/shop" className="flex items-center gap-1.5" />
          } nativeButton={false}>
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-16 bg-[#09090e] border-y border-white/5 overflow-hidden">
        <div className="absolute bottom-[-100px] left-10 w-80 h-80 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">How it Works</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Receive your vouchers and active data bundles in three super-simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative bg-[#101018] border border-white/5 p-6 rounded-2xl text-center space-y-4">
                  <div className="absolute top-4 right-6 text-3xl font-black text-indigo-500/10 font-mono">
                    {step.num}
                  </div>
                  <div className="inline-flex bg-indigo-500/5 border border-indigo-500/10 p-3.5 rounded-2xl text-indigo-400 mb-2">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Loved by Gamers & Pros</h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm">
            Read real-time responses from users across different fields in Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-[#0e0e15] border border-white/5 p-6 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic text-sm leading-relaxed">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <img 
                  src={test.avatar} 
                  alt={test.name} 
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-white text-xs leading-none mb-1">{test.name}</h4>
                  <p className="text-[10px] text-gray-500 font-medium font-mono leading-none">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Internal chevron utility
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
