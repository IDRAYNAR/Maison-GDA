import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Heart, Star, Users, MapPin, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Parfums de Niche
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Maison GDA
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection exclusive de parfums de niche. 
              Des fragrances d&apos;exception pour les amateurs de luxe à Paris et sa périphérie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/parfums">
                  Découvrir nos parfums
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  Notre histoire
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir Maison GDA ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une expertise unique dans l&apos;univers des parfums de niche, au service de votre personnalité olfactive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Sélection Exclusive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chaque parfum est soigneusement sélectionné pour sa qualité exceptionnelle et son caractère unique.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Conseil Personnalisé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notre expertise vous guide dans le choix du parfum qui vous correspond parfaitement.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Service à Domicile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nous nous déplaçons chez vous à Paris et en périphérie pour une expérience sur mesure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explorez nos Collections</h2>
            <p className="text-lg text-muted-foreground">
              Des univers olfactifs variés pour tous les goûts et toutes les occasions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Parfums Femme",
                description: "Fragrances féminines raffinées et élégantes",
                image: "/api/placeholder/300/200",
                href: "/parfums?gender=FEMME"
              },
              {
                title: "Parfums Homme",
                description: "Compositions masculines puissantes et sophistiquées",
                image: "/api/placeholder/300/200", 
                href: "/parfums?gender=HOMME"
              },
              {
                title: "Parfums Mixtes",
                description: "Fragrances unisexes pour tous les styles",
                image: "/api/placeholder/300/200",
                href: "/parfums?gender=UNISEX"
              },
              {
                title: "Eau de Parfum",
                description: "Concentration intense pour une tenue longue durée",
                image: "/api/placeholder/300/200",
                href: "/parfums?concentration=EDP"
              },
              {
                title: "Eau de Toilette",
                description: "Fraîcheur et légèreté pour le quotidien",
                image: "/api/placeholder/300/200",
                href: "/parfums?concentration=EDT"
              },
              {
                title: "Extraits de Parfum",
                description: "La quintessence du luxe olfactif",
                image: "/api/placeholder/300/200",
                href: "/parfums?concentration=Parfum"
              }
            ].map((category, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={category.href}>
                      Découvrir
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Prêt à découvrir votre parfum signature ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explorez notre collection et ajoutez vos coups de cœur à vos favoris. 
              Nous sommes là pour vous accompagner dans votre quête olfactive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/parfums">
                  Voir tous nos parfums
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/favoris">
                  <Heart className="h-4 w-4 mr-2" />
                  Mes favoris
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Contactez-nous</h2>
              <p className="text-lg text-muted-foreground">
                Pour une consultation personnalisée ou toute question sur nos parfums.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Zone de service</h3>
                <p className="text-muted-foreground">
                  Paris et sa périphérie
                  <br />
                  Déplacement à domicile
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Horaires</h3>
                <p className="text-muted-foreground">
                  Lun - Ven : 9h00 - 18h00
                  <br />
                  Samedi : 10h00 - 16h00
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Consultation</h3>
                <p className="text-muted-foreground">
                  Conseil personnalisé
                  <br />
                  Sur rendez-vous
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
