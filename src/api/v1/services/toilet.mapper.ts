import { ToiletWithRelations } from "@v1/types/types";
import {
  ToiletResponse,
  ToiletResponseWithDistance,
} from "../schemas/toilet/toilet.response.schema";

export const singleToiletResponseMapper = (
  result: ToiletWithRelations
): ToiletResponse | null => {
  if (!result) return null;
  const response: ToiletResponse = {
    id: result.id,
    name: result.name,
    description: result.description,
    paid: result.paid,
    location: {
      latitude: result.location.y,
      longitude: result.location.x,
    },
    created_by: {
      id: result.user.id,
      username: result.user.profile!.username,
      bio: result.user.profile!.bio,
    },
    features: result.toiletToFeatures.map((tf) => tf.feature),
    photos: result.photos.map((tp) => ({
      id: tp.id,
      createdAt: tp.createdAt,
      url: tp.url,
      addedBy: {
        userId: tp.userId,
        username: tp.user.profile!.username,
      },
    })),
  };
  return response;
};

export const arrayToiletResponseMapper = (
  result: (ToiletWithRelations & { distance: number | null })[]
): ToiletResponseWithDistance[] => {
  const response = result.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    paid: t.paid,
    location: {
      latitude: t.location.y,
      longitude: t.location.x,
    },
    distance: t.distance ? t.distance : null,
    created_by: {
      id: t.user.id,
      username: t.user.profile!.username,
      bio: t.user.profile!.bio,
    },
    features: t.toiletToFeatures.map((tf) => tf.feature),
    photos: t.photos.map((tp) => ({
      id: tp.id,
      createdAt: tp.createdAt,
      url: tp.url,
      addedBy: {
        userId: tp.userId,
        username: tp.user.profile!.username,
      },
    })),
  }));
  return response;
};
