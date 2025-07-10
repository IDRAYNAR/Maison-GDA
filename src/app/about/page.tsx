import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">À Propos de Maison GDA</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Notre passion pour les fragrances d'exception et notre histoire.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <img src="/api/placeholder/600/400" alt="Boutique Maison GDA" className="rounded-lg shadow-md" />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Notre Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Chez Maison GDA, notre mission est de rendre accessible une sélection pointue de parfums de niche, souvent difficiles à trouver. Nous croyons que le parfum est une forme d'expression personnelle et nous nous engageons à offrir des créations uniques qui racontent une histoire.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Notre Localisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Basés à Paris, le cœur de la parfumerie mondiale, nous servons avec passion nos clients à travers toute la France. Bien que nous soyons principalement une boutique en ligne, notre âme est profondément parisienne.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 