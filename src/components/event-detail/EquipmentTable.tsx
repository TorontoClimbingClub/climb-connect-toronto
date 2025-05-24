
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";

interface Equipment {
  id: string;
  item_name: string;
  brand: string | null;
  notes: string | null;
  user_id: string;
  owner_name: string;
  category_name: string;
}

interface EquipmentTableProps {
  equipment: Equipment[];
}

export function EquipmentTable({ equipment }: EquipmentTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Equipment Available ({equipment.length} items)
        </CardTitle>
        <CardDescription>
          Gear that participants are bringing to share
        </CardDescription>
      </CardHeader>
      <CardContent>
        {equipment.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {item.category_name}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.brand || 'N/A'}</TableCell>
                  <TableCell>{item.owner_name}</TableCell>
                  <TableCell className="max-w-xs">
                    {item.notes ? (
                      <span className="text-sm text-stone-600">{item.notes}</span>
                    ) : (
                      <span className="text-stone-400">No notes</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-stone-600">
            No equipment shared yet. Participants can add gear from their profile.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
