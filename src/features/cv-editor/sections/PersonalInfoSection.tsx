import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { personalInfoSchema, type PersonalInfoFormValues } from "@/validations/personalInfo.schema";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { useEditCheckpoint } from "../hooks/useEditCheckpoint";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { fileToResizedDataUrl } from "@/utils/image";
import { getInitials } from "@/utils/text";
import type { Cv } from "@/types/cv.types";

export function PersonalInfoSection() {
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const checkpoint = useEditCheckpoint();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: draft.personalInfo,
    mode: "onBlur",
  });

  const photoUrl = watch("photoUrl");
  const fullName = watch("fullName");

  async function handlePhotoFile(file: File | undefined) {
    if (!file) return;
    setPhotoError(null);
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choisissez un fichier image.");
      return;
    }
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setValue("photoUrl", dataUrl, { shouldDirty: true });
    } catch {
      setPhotoError("Impossible de charger cette image.");
    }
  }

  function removePhoto() {
    setPhotoError(null);
    setValue("photoUrl", "", { shouldDirty: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  useEffect(() => {
    const subscription = watch((values) => {
      updateDraft((cv) => ({
        ...cv,
        personalInfo: { ...cv.personalInfo, ...values, yearsOfExperience: Number(values.yearsOfExperience) || 0 },
      }));
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  return (
    <div {...checkpoint} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Nom complet</Label>
          <Input id="fullName" invalid={Boolean(errors.fullName)} {...register("fullName")} placeholder="Jean Dupont" />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Titre professionnel</Label>
          <Input id="title" invalid={Boolean(errors.title)} {...register("title")} placeholder="Tech Lead" />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" invalid={Boolean(errors.phone)} {...register("phone")} placeholder="+33 6 12 34 56 78" />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" invalid={Boolean(errors.email)} {...register("email")} placeholder="jean.dupont@email.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" invalid={Boolean(errors.address)} {...register("address")} placeholder="Paris, France" />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="yearsOfExperience">Années d&apos;expérience</Label>
          <Input
            id="yearsOfExperience"
            type="number"
            min={0}
            invalid={Boolean(errors.yearsOfExperience)}
            {...register("yearsOfExperience")}
          />
          {errors.yearsOfExperience && <p className="text-xs text-destructive">{errors.yearsOfExperience.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Photo</Label>
          <div className="flex items-center gap-4">
            <div
              className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background-secondary text-sm font-bold text-foreground-secondary"
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Aperçu de la photo" className="size-full object-cover" />
              ) : (
                getInitials(fullName || "?")
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoFile(e.target.files?.[0])}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload /> {photoUrl ? "Changer la photo" : "Importer une photo"}
              </Button>
              {photoUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={removePhoto}>
                  <X /> Retirer
                </Button>
              )}
            </div>
          </div>
          {photoError && <p className="text-xs text-destructive">{photoError}</p>}
          {/* Champ conservé pour react-hook-form ; alimenté par l'upload (data URL). */}
          <input type="hidden" {...register("photoUrl")} />
        </div>
      </div>
    </div>
  );
}
