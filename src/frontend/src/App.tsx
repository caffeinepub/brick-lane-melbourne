import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ChevronDown,
  Clock,
  Facebook,
  Globe,
  Heart,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { MenuItem, Review } from "./backend.d";
import { useMenuItems, useReviews } from "./hooks/useQueries";

const queryClient = new QueryClient();

// ── Hardcoded fallback data ────────────────────────────────────────────────
const FALLBACK_MENU: MenuItem[] = [
  {
    name: "Cappuccino Latte",
    description:
      "Perfectly balanced espresso with velvety steamed milk and a delicate foam cap.",
    category: "Coffee",
    priceCents: 550n,
    isPopular: true,
  },
  {
    name: "Long Black",
    description:
      "Double shot espresso over hot water — bold, intense, and satisfying.",
    category: "Coffee",
    priceCents: 450n,
    isPopular: true,
  },
  {
    name: "Chai Latte with Oat Milk",
    description:
      "Aromatic spiced chai blend with creamy oat milk, warmly spiced.",
    category: "Coffee",
    priceCents: 600n,
    isPopular: true,
  },
  {
    name: "Chai Oat Latte",
    description:
      "House-made chai concentrate with our premium oat milk, gently frothed.",
    category: "Coffee",
    priceCents: 600n,
    isPopular: false,
  },
  {
    name: "Cold Brew",
    description:
      "12-hour cold-steeped single origin, smooth with a natural sweetness.",
    category: "Coffee",
    priceCents: 700n,
    isPopular: false,
  },
  {
    name: "Salt & Poached Eggs on Soy Quinoa & Linseed Sourdough",
    description:
      "Two free-range eggs, poached to perfection, on our signature house sourdough with crunchy quinoa seeds.",
    category: "Brunch",
    priceCents: 2200n,
    isPopular: true,
  },
  {
    name: "All Scrambled Up",
    description:
      "Silky scrambled free-range eggs with chives, truffle salt on sourdough toast.",
    category: "Brunch",
    priceCents: 1900n,
    isPopular: false,
  },
  {
    name: "Smashed Avo",
    description:
      "House-smashed avocado with feta, dukkah, cherry tomatoes & microgreens on sourdough.",
    category: "Brunch",
    priceCents: 2000n,
    isPopular: true,
  },
  {
    name: "Corn Waffle",
    description:
      "Crispy on the outside, pillowy within — topped with maple butter and seasonal berries.",
    category: "Brunch",
    priceCents: 2100n,
    isPopular: true,
  },
  {
    name: "Chilli Scrambled Eggs",
    description:
      "Scrambled eggs with roasted chilli, goat cheese, and fresh herbs on toasted sourdough.",
    category: "Brunch",
    priceCents: 2000n,
    isPopular: true,
  },
  {
    name: "Eggs Benedict",
    description:
      "Poached eggs with house hollandaise on toasted English muffin, with your choice of ham or smoked salmon.",
    category: "Brunch",
    priceCents: 2300n,
    isPopular: true,
  },
  {
    name: "Lamb Salad",
    description:
      "Tender grilled lamb, roasted capsicum, baba ganoush, pomegranate molasses, and fresh herbs.",
    category: "Food",
    priceCents: 2400n,
    isPopular: true,
  },
  {
    name: "Vanilla Yoghurt Panna Cotta",
    description:
      "Silky vanilla bean panna cotta with passionfruit coulis and toasted granola.",
    category: "Food",
    priceCents: 1400n,
    isPopular: true,
  },
  {
    name: "Baba Ganoush Plate",
    description:
      "Smoky eggplant dip with house-made flatbread, olive oil, dukkah and fresh herbs.",
    category: "Food",
    priceCents: 1600n,
    isPopular: true,
  },
  {
    name: "Fresh Orange Juice",
    description: "Cold-pressed, straight from the juicer.",
    category: "Drinks",
    priceCents: 700n,
    isPopular: false,
  },
  {
    name: "House Lemonade",
    description: "Sparkling lemonade with fresh mint and a wedge of lime.",
    category: "Drinks",
    priceCents: 600n,
    isPopular: false,
  },
  {
    name: "Smoothie of the Day",
    description: "Ask your server for today's seasonal blend.",
    category: "Drinks",
    priceCents: 900n,
    isPopular: false,
  },
];

const FALLBACK_REVIEWS: Review[] = [
  {
    reviewerName: "Jenny Sim",
    rating: 5,
    date: BigInt(Date.now() - 30 * 86400000),
    content:
      "Had brunch at Brick Lane and really enjoyed it. The corn waffle was crispy on the outside, soft inside, with a nice natural sweetness — not heavy at all. The omelette was light, fluffy, and cooked perfectly.",
  },
  {
    reviewerName: "Ridhy Krishen",
    rating: 5,
    date: BigInt(Date.now() - 35 * 86400000),
    content:
      "A perfect fit into the eclectic Guildford Lane of Melbourne, this cafe offers a yummy menu in an excellent ambience. It is perfect for a team lunch on a work day or a weekend brunch outing. We were lucky to get a table on a Wednesday.",
  },
  {
    reviewerName: "Gu",
    rating: 4,
    date: BigInt(Date.now() - 21 * 86400000),
    content:
      "Brick Lane Melbourne has a great atmosphere and wonderful food. The coffee is top notch and the staff are super friendly. Highly recommend for brunch!",
  },
  {
    reviewerName: "Sarah M.",
    rating: 5,
    date: BigInt(Date.now() - 14 * 86400000),
    content:
      "Amazing service, atmosphere and food matched by the amazing coffee and drinks. Can't wait to be back, yummy foods, great coffee and super friendly staff.",
  },
  {
    reviewerName: "James T.",
    rating: 5,
    date: BigInt(Date.now() - 7 * 86400000),
    content:
      "One of Melbourne's hidden gems. The smashed avo is incredible and the sourdough bread they use is genuinely the best I've had in the city. A must-visit for brunch.",
  },
];

const GALLERY_IMAGES = [
  {
    src: "/assets/generated/hero-exterior.dim_1200x700.jpg",
    title: "Brick Lane Exterior",
    category: "Exterior",
  },
  {
    src: "/assets/generated/cafe-interior.dim_800x600.jpg",
    title: "Our Interior",
    category: "Interior",
  },
  {
    src: "/assets/generated/coffee-latte.dim_600x600.jpg",
    title: "Artisan Latte",
    category: "Coffee",
  },
  {
    src: "/assets/generated/brunch-waffle.dim_600x600.jpg",
    title: "Corn Waffle",
    category: "Brunch",
  },
  {
    src: "/assets/generated/smashed-avo.dim_600x600.jpg",
    title: "Smashed Avo",
    category: "Brunch",
  },
  {
    src: "/assets/generated/panna-cotta.dim_600x600.jpg",
    title: "Panna Cotta",
    category: "Dessert",
  },
];

const MENU_CATEGORIES = ["Coffee", "Brunch", "Food", "Drinks"];

const CATEGORY_IMAGES: Record<string, string> = {
  Coffee: "/assets/generated/coffee-latte.dim_600x600.jpg",
  Brunch: "/assets/generated/smashed-avo.dim_600x600.jpg",
  Food: "/assets/generated/panna-cotta.dim_600x600.jpg",
  Drinks: "/assets/generated/brunch-waffle.dim_600x600.jpg",
};

function formatPrice(cents: bigint): string {
  const dollars = Number(cents) / 100;
  return `$${dollars.toFixed(2).replace(".00", "")}`;
}

function timeAgo(timestamp: bigint): string {
  const ms =
    Number(timestamp) > 1e15 ? Number(timestamp) / 1e6 : Number(timestamp);
  const diff = Date.now() - ms;
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function StarRating({
  rating,
  size = "sm",
}: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className={`flex gap-0.5 ${size === "lg" ? "gap-1" : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === "lg" ? "w-5 h-5" : "w-4 h-4"} ${
            star <= rating ? "fill-accent text-accent" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

// ── Nav ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Menu", href: "#menu", ocid: "nav.menu_link" },
    { label: "Gallery", href: "#gallery", ocid: "nav.gallery_link" },
    { label: "Reviews", href: "#reviews", ocid: "nav.reviews_link" },
    { label: "Contact", href: "#contact", ocid: "nav.contact_link" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-warm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">
                BL
              </span>
            </div>
            <span
              className={`font-display font-bold text-xl tracking-tight transition-colors ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              Brick Lane
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid={link.ocid}
                className={`font-body font-medium text-sm tracking-wide transition-colors hover:text-primary ${
                  scrolled ? "text-foreground" : "text-white/90"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Button
              asChild
              data-ocid="nav.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold text-sm px-5"
            >
              <a href="tel:+61416198743">Book a Table</a>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className={`md:hidden p-2 rounded-md transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-ocid={link.ocid}
                  onClick={() => setMobileOpen(false)}
                  className="font-body font-medium text-foreground py-2 border-b border-border last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <Button
                asChild
                data-ocid="nav.primary_button"
                className="bg-primary text-primary-foreground font-body font-semibold mt-2"
              >
                <a href="tel:+61416198743">Book a Table</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      <img
        src="/assets/generated/hero-exterior.dim_1200x700.jpg"
        alt="Brick Lane Melbourne exterior"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-accent text-accent-foreground font-body text-sm px-3 py-1">
              <Star className="w-3.5 h-3.5 mr-1 fill-current" />
              4.4 · 2,664 reviews
            </Badge>
            <Badge
              variant="outline"
              className="border-white/30 text-white font-body text-sm"
            >
              Melbourne, VIC
            </Badge>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            Brick Lane
            <br />
            <span className="italic font-normal text-accent">Melbourne</span>
          </h1>

          <p className="font-body text-white/85 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            Craft coffee & creative brunch in the heart of Melbourne's laneways
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              data-ocid="hero.primary_button"
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold text-base px-8"
            >
              <a href="#menu">View Menu</a>
            </Button>
            <Button
              asChild
              data-ocid="hero.secondary_button"
              size="lg"
              variant="outline"
              className="border-white/50 text-white bg-white/10 hover:bg-white/20 font-body font-semibold text-base px-8"
            >
              <a href="#contact">Find Us</a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body text-primary font-semibold text-sm tracking-widest uppercase mb-4">
              Est. Melbourne
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Where Every Cup
              <br />
              <em className="text-primary not-italic">Tells a Story</em>
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              A perfect fit into the eclectic Guildford Lane of Melbourne. We
              offer craft coffee, creative brunch options, and a bustling
              cafe-bakery experience with our signature vintage redbrick facade.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Nestled at 33 Guildford Lane, we've been serving Melbourne's food
              lovers with thoughtfully sourced ingredients, house-baked bread,
              and specialty coffee roasted locally. Every dish is crafted with
              care — from the first sip to the last bite.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Dine-in", "Takeaway", "Delivery", "LGBTQ+ Friendly"].map(
                (badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="font-body text-sm px-3 py-1 bg-secondary text-secondary-foreground"
                  >
                    {badge}
                  </Badge>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-warm-lg">
              <img
                src="/assets/generated/cafe-interior.dim_800x600.jpg"
                alt="Brick Lane cafe interior"
                className="w-full h-[440px] object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-warm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-foreground text-sm">
                      33 Guildford Ln
                    </p>
                    <p className="font-body text-muted-foreground text-xs">
                      Melbourne VIC 3000
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-primary/10 -z-10" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 rounded-full bg-accent/15 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Menu ───────────────────────────────────────────────────────────────────
function MenuSection() {
  const { data: backendItems } = useMenuItems();
  const items =
    backendItems && backendItems.length > 0 ? backendItems : FALLBACK_MENU;

  const byCategory = MENU_CATEGORIES.reduce<Record<string, MenuItem[]>>(
    (acc, cat) => {
      acc[cat] = items.filter((i) => i.category === cat);
      return acc;
    },
    {},
  );

  return (
    <section id="menu" className="py-20 md:py-28 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Our Menu
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Made with Care,
          </h2>
          <p className="font-display text-4xl md:text-5xl font-bold italic text-primary">
            Served with Love
          </p>
        </motion.div>

        <Tabs defaultValue="Coffee">
          <TabsList className="flex w-full max-w-lg mx-auto mb-12 bg-background border border-border p-1 rounded-full">
            {MENU_CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                data-ocid="menu.tab"
                className="flex-1 font-body font-medium text-sm rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {MENU_CATEGORIES.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {byCategory[cat]?.map((item, idx) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="group overflow-hidden border-border hover:shadow-warm-lg transition-all duration-300 bg-card">
                      {idx === 0 && (
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={CATEGORY_IMAGES[cat]}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {item.isPopular && (
                            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-body text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-display font-semibold text-foreground text-base leading-snug">
                                {item.name}
                              </h3>
                              {item.isPopular && idx !== 0 && (
                                <Badge
                                  variant="outline"
                                  className="border-primary text-primary text-xs flex-shrink-0"
                                >
                                  ★
                                </Badge>
                              )}
                            </div>
                            <p className="font-body text-muted-foreground text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          <span className="font-display font-bold text-primary text-lg flex-shrink-0">
                            {formatPrice(item.priceCents)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

// ── Gallery ────────────────────────────────────────────────────────────────
function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Gallery
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            A Feast for
          </h2>
          <p className="font-display text-4xl md:text-5xl font-bold italic text-primary">
            the Eyes
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY_IMAGES.map((img, idx) => (
            <motion.button
              key={img.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setLightbox(idx)}
              className={`relative overflow-hidden rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                idx === 0 ? "col-span-2 row-span-2" : ""
              }`}
              style={{ aspectRatio: idx === 0 ? "4/3" : "1/1" }}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 hover:bg-foreground/25 transition-colors duration-300 flex items-end p-4">
                <span className="font-body font-medium text-white text-sm opacity-0 group-hover:opacity-100 translate-y-2 hover:translate-y-0 transition-all">
                  {img.title}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_IMAGES[lightbox].src}
                alt={GALLERY_IMAGES[lightbox].title}
                className="max-h-[85vh] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white rounded-lg px-3 py-2 font-body text-sm">
                {GALLERY_IMAGES[lightbox].title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Reviews ────────────────────────────────────────────────────────────────
function Reviews() {
  const { data: backendReviews } = useReviews();
  const reviews =
    backendReviews && backendReviews.length > 0
      ? backendReviews
      : FALLBACK_REVIEWS;

  return (
    <section
      id="reviews"
      data-ocid="reviews.section"
      className="py-20 md:py-28 bg-primary/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Reviews
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            What Our Guests Say
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="font-display text-6xl font-bold text-primary">
                4.4
              </p>
              <StarRating rating={4} size="lg" />
              <p className="font-body text-muted-foreground text-sm mt-1">
                2,664 reviews
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review, idx) => (
            <motion.div
              key={`${review.reviewerName}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card className="h-full border-border bg-card hover:shadow-warm transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                        <span className="font-display font-bold text-primary text-sm">
                          {review.reviewerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-body font-semibold text-foreground text-sm">
                          {review.reviewerName}
                        </p>
                        <p className="font-body text-muted-foreground text-xs">
                          {timeAgo(review.date)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="font-body text-muted-foreground text-sm leading-relaxed mt-3">
                    "{review.content}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ────────────────────────────────────────────────────────────────
function Contact() {
  const infos = [
    {
      icon: MapPin,
      label: "Address",
      value: "33 Guildford Ln, Melbourne VIC 3000, Australia",
      link: "https://maps.google.com/?q=33+Guildford+Lane+Melbourne",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+61 416 198 743",
      link: "tel:+61416198743",
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon–Fri 7:30am–4pm · Sat–Sun 8am–4pm",
      link: null,
    },
    {
      icon: Globe,
      label: "Website",
      value: "thebricklane.com.au",
      link: "https://thebricklane.com.au",
    },
  ];

  return (
    <section
      id="contact"
      data-ocid="contact.section"
      className="py-20 md:py-28 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="font-body text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            Find Us
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Come Visit Us
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-warm-lg bg-secondary/50 border border-border"
          >
            <div className="relative h-80 md:h-96 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/10 to-accent/20">
              {/* Stylized map representation */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, oklch(0.42 0.14 27 / 0.3) 0px, transparent 1px, transparent 40px, oklch(0.42 0.14 27 / 0.3) 41px), repeating-linear-gradient(90deg, oklch(0.42 0.14 27 / 0.3) 0px, transparent 1px, transparent 40px, oklch(0.42 0.14 27 / 0.3) 41px)",
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary shadow-warm flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="bg-card/90 backdrop-blur-sm rounded-xl px-6 py-4 text-center shadow-warm">
                  <p className="font-display font-bold text-foreground text-lg">
                    Brick Lane Melbourne
                  </p>
                  <p className="font-body text-muted-foreground text-sm">
                    33 Guildford Ln, Melbourne VIC 3000
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=33+Guildford+Lane+Melbourne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            {infos.map((info, idx) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-border hover:shadow-warm transition-shadow duration-200">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-foreground text-sm mb-0.5">
                          {info.label}
                        </p>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={
                              info.link.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              info.link.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="font-body text-muted-foreground text-sm hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-body text-muted-foreground text-sm">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-bold text-primary">
                    $20–40
                  </span>
                  <div>
                    <p className="font-body font-semibold text-foreground text-sm">
                      Price Range
                    </p>
                    <p className="font-body text-muted-foreground text-xs">
                      Per person · reported by guests
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">
                  BL
                </span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Brick Lane
              </span>
            </div>
            <p className="font-body text-white/60 text-sm leading-relaxed max-w-xs">
              Craft coffee & creative brunch in the heart of Melbourne's
              laneways. Come say hello.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="font-body font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Quick Links
            </p>
            <ul className="space-y-2">
              {["Menu", "Gallery", "Reviews", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="font-body text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <p className="font-body font-semibold text-white text-sm tracking-wider uppercase mb-4">
              Visit Us
            </p>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-body text-white/60 text-sm">
                  33 Guildford Ln, Melbourne VIC 3000
                </span>
              </li>
              <li className="flex gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+61416198743"
                  className="font-body text-white/60 text-sm hover:text-white transition-colors"
                >
                  +61 416 198 743
                </a>
              </li>
              <li className="flex gap-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-body text-white/60 text-sm">
                  Mon–Fri 7:30am–4pm
                  <br />
                  Sat–Sun 8am–4pm
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-white/40 text-xs">
            © {year} Brick Lane Melbourne. All rights reserved.
          </p>
          <p className="font-body text-white/40 text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-primary fill-primary" />{" "}
            using{" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
function BrickLaneSite() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <MenuSection />
        <Gallery />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrickLaneSite />
    </QueryClientProvider>
  );
}
