import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Nos Collections</h1>
        <p className="text-muted-foreground">
          Explorez nos collections thématiques et trouvez l'inspiration.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Contenu à venir</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page présentera bientôt nos collections exclusives, organisées par thèmes olfactifs.</p>
        </CardContent>
      </Card>
    </div>
  );
} 