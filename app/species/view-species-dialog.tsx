"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { type Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
type Species = Database["public"]["Tables"]["species"]["Row"];

const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

const speciesSchema = z.object({
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val?.trim()),
  common_name: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
  total_population: z.number().int().positive().min(1).optional(),
  kingdom: kingdoms,
  description: z
    .string()
    .nullable()
    .transform((val) => (val?.trim() === "" ? null : val?.trim())),
});

type FormData = z.infer<typeof speciesSchema>;

const defaultValues: Partial<FormData> = {
  kingdom: "Animalia",
};

export default function ViewSpeciesDialog(species : Species) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          View Species
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Learn More</DialogTitle>
          <DialogDescription>
            Learn more about this species! Click &quot;Close&quot; below when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm">Scientific Name: </p>
        <h4 className="mt-3 text-lg font-semibold" style={{marginTop: 0, paddingTop: 0}}>{species.species.scientific_name}</h4>

        <p className="text-sm">Common Name: </p>
        <h4 className="mt-3 text-lg font-semibold" style={{marginTop: 0, paddingTop: 0}}>{species.species.common_name}</h4>

        <p className="text-sm">Total Population: </p>
        <h4 className="mt-3 text-lg font-semibold" style={{marginTop: 0, paddingTop: 0}}>{species.species.total_population}</h4>

        <p className="text-sm">Kingdom: </p>
        <h4 className="mt-3 text-lg font-semibold" style={{marginTop: 0, paddingTop: 0}}>{species.species.kingdom}</h4>

        <p className="text-sm">Description: </p>
        <h4 className="mt-3 text-lg font-semibold" style={{marginTop: 0, paddingTop: 0}}>{species.species.description}</h4>

            <div className="flex">
              <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
      </DialogContent>
    </Dialog>
  );
}
