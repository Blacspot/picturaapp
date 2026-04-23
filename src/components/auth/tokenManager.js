import { auth } from "../../auth/firebasestub";

/**
 * Returns a valid, fresh Firebase ID token.
 * Passes true to force a refresh if the token is
 * approaching expiry — Firebase handles the timing internally.
 */
export const getFreshToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user found.');
  return user.getIdToken(true);
};