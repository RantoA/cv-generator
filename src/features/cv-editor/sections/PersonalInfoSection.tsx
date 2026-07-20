import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, type PersonalInfoFormValues } from "@/validations/personalInfo.schema";
import { useCvEditorStore } from "@/stores/useCvEditorStore";
import { useEditCheckpoint } from "../hooks/useEditCheckpoint";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { Cv } from "@/types/cv.types";

export function PersonalInfoSection() {
  const draft = useCvEditorStore((s) => s.draft as Cv);
  const updateDraft = useCvEditorStore((s) => s.updateDraft);
  const checkpoint = useEditCheckpoint();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: draft.personalInfo,
    mode: "onBlur",
  });

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
          <Label htmlFor="photoUrl">Photo (URL)</Label>
          <Input id="photoUrl" {...register("photoUrl")} placeholder="https://…" />
        </div>
      </div>
    </div>
  );
}
