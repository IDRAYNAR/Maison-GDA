import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Maison GDA</h3>
            <p className="text-sm text-muted-foreground">
              Spécialiste des parfums de niche à Paris et sa périphérie. 
              Découvrez notre sélection exclusive de fragrances d&apos;exception.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Paris et périphérie</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/parfums" className="text-sm text-muted-foreground hover:text-primary">
                Parfums
              </Link>
              <Link href="/marques" className="text-sm text-muted-foreground hover:text-primary">
                Marques
              </Link>
              <Link href="/collections" className="text-sm text-muted-foreground hover:text-primary">
                Collections
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                À propos
              </Link>
            </nav>
          </div>

          {/* Service Client */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Client</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@maison-gda.fr</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Lun - Ven: 9h00 - 18h00</p>
              <p>Sam: 10h00 - 16h00</p>
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/livraison" className="text-sm text-muted-foreground hover:text-primary">
                Livraison
              </Link>
              <Link href="/retours" className="text-sm text-muted-foreground hover:text-primary">
                Retours
              </Link>
              <Link href="/confidentialite" className="text-sm text-muted-foreground hover:text-primary">
                Confidentialité
              </Link>
              <Link href="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary">
                Mentions légales
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Maison GDA. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
} 