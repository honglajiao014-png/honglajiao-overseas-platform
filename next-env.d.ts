/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

declare module "bcryptjs" {
  export function hashSync(s: string, salt: number): string;
  export function compareSync(s: string, hash: string): boolean;
}
