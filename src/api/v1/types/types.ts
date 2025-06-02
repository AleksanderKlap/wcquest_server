import { getToiletById } from "../repos/toilet.repo";

export type ToiletWithRelations = Awaited<ReturnType<typeof getToiletById>>;
export type ToiletWithRelationsAndDistance = ToiletWithRelations & {
  distance: number | null;
};
