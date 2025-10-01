import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen tokyo-drift-bg relative overflow-hidden">
      <div className="neon-trail neon-trail-cyan" style={{ top: "10%", animationDelay: "0s" }} />
      <div className="neon-trail neon-trail-pink" style={{ top: "25%", animationDelay: "2s" }} />
      <div className="neon-trail neon-trail-purple" style={{ top: "40%", animationDelay: "1s" }} />
      <div className="neon-trail neon-trail-mint" style={{ top: "55%", animationDelay: "3s" }} />
      <div className="neon-trail neon-trail-cyan" style={{ top: "70%", animationDelay: "4s" }} />
      <div className="neon-trail neon-trail-pink" style={{ top: "85%", animationDelay: "5s" }} />

      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(0, 217, 255, 0.3) 0%, transparent 70%)",
          top: "10%",
          left: "5%",
          animationDuration: "4s",
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(255, 0, 110, 0.3) 0%, transparent 70%)",
          top: "50%",
          right: "10%",
          animationDuration: "5s",
          animationDelay: "1s",
        }}
      />
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(127, 255, 212, 0.3) 0%, transparent 70%)",
          bottom: "20%",
          left: "15%",
          animationDuration: "6s",
          animationDelay: "2s",
        }}
      />

      {/* Header */}
      <header className="border-b border-primary/30 backdrop-blur-md sticky top-0 z-50 bg-background/70">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-24 h-24 group cursor-pointer">
              <img
                src="/mtd-logo-final.png"
                alt="MTD Logo"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                style={{
                  filter: "hue-rotate(-35deg) saturate(1.3) brightness(1.05)",
                }}
              />
            </div>
            <span className="text-xl font-bold tracking-tight">MotoArt Helmets</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </a>
            <a href="#shop" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_15px_rgba(0,217,255,0.4)]">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border-2 border-accent/60 bg-accent/20 text-accent font-bold text-sm shadow-[0_0_15px_rgba(255,0,110,0.3)]">
              TOKYO DRIFT COLLECTION
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
              Race the Night. <span className="gradient-text-neon">Own the Streets.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto text-pretty">
              Born from the neon-lit streets of Tokyo. Each helmet captures the raw energy of street racing culture with
              bold colors, futuristic patterns, and uncompromising protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 font-bold shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all"
              >
                Explore Collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-accent/60 hover:bg-accent/20 text-accent font-bold text-base px-8 bg-transparent shadow-[0_0_15px_rgba(255,0,110,0.2)] hover:shadow-[0_0_20px_rgba(255,0,110,0.3)] transition-all"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="shop" className="py-20 md:py-28 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              <span className="gradient-text-neon">Street Racing Legends</span>
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto text-pretty">
              Each helmet is a tribute to the underground racing scene. Bold designs, neon accents, and street-ready
              attitude.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product, index) => {
              const glowClasses = ["neon-glow-cyan", "neon-glow-pink", "neon-glow-mint", "neon-glow-purple"]
              const glowClass = glowClasses[index % glowClasses.length]

              return (
                <Card key={index} className={`group overflow-hidden ${glowClass} bg-card transition-all duration-300`}>
                  <div className="relative aspect-square overflow-hidden bg-secondary/50">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-[0_0_12px_rgba(255,0,110,0.5)]">
                      LIMITED
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{product.name}</h3>
                    <p className="text-foreground/70 text-sm mb-4 leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-secondary/20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              <span className="gradient-text-neon">Street Legends Speak</span>
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto text-pretty">
              Join the crew of riders who've embraced the Tokyo Drift lifestyle.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => {
              const glowClasses = ["neon-glow-cyan", "neon-glow-pink", "neon-glow-mint"]
              const glowClass = glowClasses[index % glowClasses.length]

              return (
                <Card key={index} className={`${glowClass} bg-card`}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]"
                        />
                      ))}
                    </div>
                    <p className="text-foreground mb-6 leading-relaxed">"{testimonial.review}"</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(0,217,255,0.3)]"
                        style={{
                          background: testimonial.gradient,
                        }}
                      >
                        <span className="text-lg font-bold text-white drop-shadow-md">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-foreground/60">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border-2 border-primary/50 p-12 md:p-16 lg:p-20 shadow-[0_0_40px_rgba(0,217,255,0.2),0_0_60px_rgba(255,0,110,0.15)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
                <span className="gradient-text-neon">Limited Tokyo Drift Edition</span>
              </h2>
              <p className="text-lg text-foreground/80 mb-8 text-pretty">
                Only 100 pieces per design. Each helmet is individually numbered with a holographic certificate of
                authenticity. Once they're gone, they're gone forever.
              </p>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base px-10 shadow-[0_0_20px_rgba(255,0,110,0.4)] hover:shadow-[0_0_30px_rgba(255,0,110,0.5)] transition-all"
              >
                Claim Yours Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/30 py-12 md:py-16 relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative w-20 h-20 group cursor-pointer">
                  <img
                    src="/mtd-logo-final.png"
                    alt="MTD Logo"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    style={{
                      filter: "hue-rotate(-35deg) saturate(1.3) brightness(1.05)",
                    }}
                  />
                </div>
                <span className="text-xl font-bold">MotoArt Helmets</span>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Born from Tokyo's underground racing scene. Redefining motorcycle culture with neon-fueled artistry.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Shop</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    All Helmets
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Tokyo Drift Edition
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Limited Releases
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Accessories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-accent">Company</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-primary">Newsletter</h3>
              <p className="text-sm text-foreground/70 mb-4">Get exclusive drops and street racing updates.</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-secondary/50 border-primary/30 text-foreground placeholder:text-foreground/50"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_12px_rgba(0,217,255,0.3)]">
                  Join
                </Button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-primary/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/60">© 2025 MotoArt Helmets. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const products = [
  {
    name: "Cyber Raven",
    description:
      "🌃 Born on the Bayshore Route: Sleek black shell with cyan neon circuit patterns that trace Tokyo's expressway system. The raven emblem glows under streetlights.",
    price: 599,
    image: "/tokyo-drift-cyber-raven-black-helmet-with-cyan-ne.jpg",
  },
  {
    name: "Neon Skull",
    description:
      "💀 Underground legend: Hot pink neon skull design inspired by Shibuya's street art scene. Each skull detail pulses with the energy of midnight racing culture.",
    price: 649,
    image: "/tokyo-drift-neon-skull-helmet-with-pink-neon-skul.jpg",
  },
  {
    name: "Retro Blaze",
    description:
      "🔥 Speed incarnate: Neon flame trails in cyan and pink streak across the shell like light trails from a long-exposure shot. Pure velocity captured in design.",
    price: 579,
    image: "/tokyo-drift-retro-blaze-helmet-with-neon-flame-tr.jpg",
  },
  {
    name: "Graffiti Edge",
    description:
      "🎨 Street canvas: Tokyo's underground artists tagged this with neon spray paint effects. Every line and splash represents the rebellion of street racing culture.",
    price: 629,
    image: "/tokyo-drift-graffiti-edge-helmet-with-neon-street.jpg",
  },
  {
    name: "BioMech Phantom",
    description:
      "🤖 Cyberpunk fusion: Biomechanical patterns glow with purple and cyan neon. Looks like it was pulled straight from a Neo-Tokyo sci-fi thriller.",
    price: 699,
    image: "/tokyo-drift-biomech-phantom-helmet-with-purple-cya.jpg",
  },
  {
    name: "Lunar Glow",
    description:
      "🌙 Night rider's dream: Holographic neon moon phases shift across white shell. Captures the magic of Tokyo's neon-lit nights under a full moon.",
    price: 679,
    image: "/tokyo-drift-lunar-glow-helmet-with-holographic-ne.jpg",
  },
  {
    name: "Dragon Fury",
    description:
      "🐉 Eastern power: Traditional dragon design reimagined with pink and cyan neon accents. Ancient mythology meets modern street racing in explosive style.",
    price: 729,
    image: "/tokyo-drift-dragon-fury-helmet-with-neon-dragon-p.jpg",
  },
  {
    name: "Chrome Samurai",
    description:
      "⚔️ Warrior spirit: Modeled after authentic samurai kabuto helmets from the Edo period. The chrome finish reflects your surroundings like a mirror.",
    price: 749,
    image: "/futuristic-motorcycle-helmet-with-chrome-samurai-a.jpg",
  },
  {
    name: "Cosmic Voyager",
    description:
      "🌌 Space fact: The galaxy pattern uses actual NASA Hubble telescope imagery. You're literally wearing the cosmos on your head.",
    price: 689,
    image: "/futuristic-motorcycle-helmet-with-deep-space-galax.jpg",
  },
  {
    name: "Venom Strike",
    description:
      "🐍 Wild detail: The scale pattern mimics the green tree python's natural camouflage. The design changes appearance under different lighting conditions.",
    price: 709,
    image: "/futuristic-motorcycle-helmet-with-green-and-black-.jpg",
  },
  {
    name: "Midnight Drift",
    description:
      "🏁 Born on the Shuto Expressway: Inspired by legendary midnight runs through Tokyo's C1 loop. The cyan neon stripes trace the exact racing line used by street legends.",
    price: 649,
    image: "/tokyo-drift-black-helmet-with-cyan-neon-racing-st.jpg",
  },
  {
    name: "Neon Samurai",
    description:
      "⚡ East meets speed: Fuses traditional Japanese warrior aesthetics with modern street racing. The pink neon accents pulse like the heartbeat of Shibuya at 2 AM.",
    price: 679,
    image: "/tokyo-drift-white-helmet-with-pink-neon-samurai-p.jpg",
  },
  {
    name: "Circuit Breaker",
    description:
      "🌆 Urban legend: Named after the infamous Daikoku Parking Area meets. Purple neon circuits map out Tokyo's underground racing network in glowing detail.",
    price: 699,
    image: "/tokyo-drift-matte-black-helmet-with-purple-neon-c.jpg",
  },
  {
    name: "Drift King",
    description:
      "👑 Tribute to legends: Honors the pioneers of drift culture. Mint green accents represent the smoke trails left by perfectly executed drifts on mountain passes.",
    price: 729,
    image: "/tokyo-drift-glossy-helmet-with-mint-green-neon-dr.jpg",
  },
  {
    name: "Akira Rising",
    description:
      "🏍️ Cyberpunk homage: Direct inspiration from Neo-Tokyo's neon-soaked streets. The red and cyan clash creates that iconic anime aesthetic every rider dreams of.",
    price: 749,
    image: "/tokyo-drift-red-and-cyan-neon-helmet-inspired-by-.jpg",
  },
  {
    name: "Street Phantom",
    description:
      "👻 Ghost in the machine: Designed for riders who vanish into the night. Holographic pink and purple shift colors as you carve through city streets at speed.",
    price: 689,
    image: "/tokyo-drift-black-helmet-with-holographic-pink-pu.jpg",
  },
  {
    name: "Voltage Rush",
    description:
      "⚡ Electric energy: Captures the adrenaline surge of hitting VTEC at midnight. Cyan lightning bolts trace power lines across the glossy black shell.",
    price: 669,
    image: "/tokyo-drift-helmet-with-cyan-lightning-bolt-neon-.jpg",
  },
  {
    name: "Kanji Racer",
    description:
      "🈴 Language of speed: Features authentic Japanese racing kanji that translate to 'speed,' 'victory,' and 'fearless.' Each character glows with mint neon intensity.",
    price: 709,
    image: "/tokyo-drift-white-helmet-with-mint-neon-japanese-.jpg",
  },
  {
    name: "Rave Velocity",
    description:
      "🎵 Soundtrack to speed: Inspired by Tokyo's underground club scene. The multi-color neon waves pulse like a visual equalizer responding to your engine's roar.",
    price: 719,
    image: "/tokyo-drift-helmet-with-multi-color-neon-wave-pat.jpg",
  },
  {
    name: "Touge Master",
    description:
      "🏔️ Mountain pass legend: Built for the twisty roads of Hakone and Usui. Purple and cyan contour lines map elevation changes like a topographic racing guide.",
    price: 739,
    image: "/tokyo-drift-helmet-with-purple-cyan-topographic-n.jpg",
  },
]

const testimonials = [
  {
    name: "Alex Rivera",
    location: "Los Angeles, CA",
    review:
      "The Cyber Raven is absolutely stunning! I get compliments everywhere I ride. The quality is top-notch and it fits perfectly.",
    gradient: "linear-gradient(135deg, #00d9ff 0%, #0099ff 100%)",
  },
  {
    name: "Jordan Chen",
    location: "Tokyo, Japan",
    review:
      "Finally found a helmet that matches my style. The Neon Skull is a work of art. Safety meets aesthetics perfectly.",
    gradient: "linear-gradient(135deg, #ff006e 0%, #9d4edd 100%)",
  },
  {
    name: "Sam Martinez",
    location: "Miami, FL",
    review: "BioMech Phantom exceeded all expectations. The attention to detail is incredible. Worth every penny!",
    gradient: "linear-gradient(135deg, #7fffd4 0%, #00d9ff 100%)",
  },
]
