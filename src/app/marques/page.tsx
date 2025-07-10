import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarquesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Nos Marques</h1>
        <p className="text-muted-foreground">
          Découvrez les créateurs et maisons de parfum derrière nos fragrances d&apos;exception.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contenu à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page affichera bientôt la liste de toutes nos marques partenaires.</p>
        </CardContent>
      </Card>
    </div>
  );
} 